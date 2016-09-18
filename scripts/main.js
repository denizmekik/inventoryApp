var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var History = ReactRouter.History;

var helper = require('./helpers');

var App = React.createClass({
  getInitialState: function() {
    return (
      {
        fishes: {},
        order:{}
      }
    )
  },
  addFish: function(fish) {
    var timeStamp = (new Date()).getTime();
    this.state.fishes['fish' + timeStamp] = fish

    this.setState({fishes: this.state.fishes});

  },
  addOrder: function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order});

  },
  loadFishes: function() {
    this.setState({
      fishes: require('./sample-fishes.js')
    });
  },
  renderFish: function(key) {
    return (
      <Fish key={key} index={key} details={this.state.fishes[key]} addOrder={this.addOrder} />
    )
  },

  render : function(){
    return (
      <div className="catch-of-the-day">
      <div className="menu">
        <Header tagline="Fresh Seafood Market"/>
        <ul>
          
         {Object.keys(this.state.fishes).map(this.renderFish)}
          
        </ul>
      </div>
      <Order />
      <Inventory addFish={this.addFish} loadFishes={this.loadFishes}/>
    </div>
  )
  }
})

var Header = React.createClass({
  render : function() {
    return (
    <header className="top">
      <h1>Catch
        <span className="ofThe">
          <span className="of"> of </span>
          <span className="the"> the </span>
        </span>
        Day</h1>
      <h3 className="tagline"><span>{this.props.tagline}</span></h3>
    </header>
    )
  }
})

var Order = React.createClass({
  render : function() {
    return (
    <p>Order</p>
    )
  }
})

var Inventory = React.createClass({
  render : function() {
    return (
     <div>
       <h3>Inventory</h3>
       <AddFishForm addFish={this.props.addFish}/>
       <button onClick={this.props.loadFishes}>Load Sample Fishes</button>
     </div>
    )
  }
})

var Fish = React.createClass({
  onButtonClick: function() {
    this.props.addOrder(this.props.index);
  },
  render: function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!');
    return (
      <li className="menu-fish"> 
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{helper.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>
          {buttonText}
        </button>
      </li>
    )
  }
})

var AddFishForm = React.createClass({
  myFunction: function(event) {
    event.preventDefault();
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }
    // 3. Add the fish to the App State
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  
  },
  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
    )
  }
})

var StorePicker = React.createClass({
  mixins : [History],
  goToStore: function(event) {
    event.preventDefault();
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId) 
  },
  render: function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" defaultValue={helper.getFunName()}/>
        <input type="submit" />
      </form>
    )
  }
});

var NotFound = React.createClass({
  render: function() {
    return <h1>Not Found!</h1>
  }
})

var routes = (
   <Router history={createBrowserHistory()}>
     <Route path="/" component={StorePicker}/>
     <Route path="/store/:storeId" component={App}/>
     <Route path="*" component={NotFound} />
   </Router>
  )

ReactDOM.render(routes, document.querySelector('#main'));

