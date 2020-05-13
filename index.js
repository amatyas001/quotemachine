const QuoteMachine = ({ quotes }) => {
  const [ quote, setQuote ] = React.useState( "" );
  React.useEffect( () => {
    const fetchData = async () => {
      const result = await quotes();
      setQuote( result );
    }
    fetchData();
  }, [] );
  return (
    <section
      id="quote-box" 
      style={{ backgroundColor: '#242444', height: '100vh' }} 
      className="d-flex flex-column align-items-center p-4">
      <blockquote 
        id="text"
        className="text-light blockquote text-center mt-auto">
        { quote.text }
      </blockquote>
      <footer 
        id="author" 
        className="blockquote-footer mb-auto">
        <cite>{ quote.author || "Anonymus" }</cite>
      </footer>
      <div className="mt-auto mb-4">
        <button 
          id="new-quote" 
          className="btn btn-dark btn-lg mr-4"
          onClick={ async () => setQuote( await quotes() ) }> 
          <strong> Give Me More! </strong>
        </button>
        <a 
          target="_blank" 
          href={`https://twitter.com/intent/tweet?text=${ encodeURIComponent( quote.text + " — "  + ( quote.author || 'Anonymus' ))}%0A&hashtags=QuoteOfTheDay,MakeMeHappy,Inspiration`} 
          id="tweet-quote" 
          className="btn btn-primary btn-lg">
          <strong> Tweet </strong>&nbsp;<i class="fab fa-twitter"></i>
        </a>        
      </div>
    </section>
  )
}

const getQuotes = async () => {
  let result;
  await fetch( 'https://type.fit/api/quotes' )
  .then( res => res.json() )
  .then( data => {
    result = data[ Math.floor( Math.random() * data.length ) ];
  });
  return result;
}

ReactDOM.render( <QuoteMachine quotes={ () => getQuotes() } />, document.getElementById( 'root' ));

// Test suit

const {
  core: { describe, it, expect, run, jest, beforeEach, afterEach },
  enzyme: { mount },
  prettify
} = window.jestLite;

describe( 'QuoteMachine', () => {
  let wrapper, mockQuotes;
  beforeEach( async () => {
    mockQuotes = jest.fn( () => Promise.resolve({ text: 'quote1', author: 'author1' }));  
    wrapper = await mount( <QuoteMachine  quotes={ () => mockQuotes() } /> );
    mockQuotes.mockClear();
  })
  it( 'render component with initialized quote', () => {
    expect.assertions( 3 );
    expect( wrapper.exists() ).toBeTruthy();
    expect( wrapper.find( '#text' ).text() ).toEqual( 'quote1' );
    expect( wrapper.find( '#author' ).text() ).toEqual( 'author1' );
  });
  it( 'clicking the new quote button calls the api', async () => {
    wrapper.find( '#new-quote' ).prop( 'onClick' )();
    expect.assertions( 3 );
    expect( mockQuotes ).toHaveBeenCalledTimes( 1 );
    expect( wrapper.find( '#text' ).text() ).toEqual( 'quote1' );
    expect( wrapper.find( '#author' ).text() ).toEqual( 'author1' );
  });
});

prettify.toHTML( run(), document.body );
