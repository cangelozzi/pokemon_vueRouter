import Vue from "vue";

const EventBus = new Vue();

// There’s one last thing we need to consider.If we try to use the browser back / forward buttons to navigate through the browser history, our application will not currently re - render correctly.Although unexpected, this occurs because no event notifier is emitted when the user clicks browser back or browser forward.
// To make this work, we’ll use the onpopstate event handler.
// The onpopstate event is fired each time the active history entry changes.A history change is invoked by clicking the browser back or browser forward buttons, or calling history.back() or history.forward() programmatically.
window.addEventListener('popstate', () => {
  EventBus.$emit('navigate');
});
// -------------------------------------------------------------------------------

//! Card #1
const CharizardCard = {
  name: 'charizard-card',
  template: `
    <div class="card card--charizard has-text-weight-bold has-text-white">
      <div class="card-image">
        <div class="card-image-container">
          <img src="../../static/charizard.png"/>
        </div>
      </div>
      <div class="card-content has-text-centered">
        <div class="main">
          <div class="title has-text-white">Charizard</div>
          <div class="hp">hp 78</div>
        </div>
        <div class="stats columns is-mobile">
          <div class="column">🔥<br>
            <span class="tag is-warning">Type</span>
          </div>
          <div class="column center-column">199 lbs<br>
            <span class="tag is-warning">Weight</span>
          </div>
          <div class="column">1.7 m <br>
            <span class="tag is-warning">Height</span>
          </div>
        </div>
      </div>
    </div>
  `
};

//! Card #2
const BlastoiseCard = {
  name: "blastoise-card",
  template: `
    <div class="card card--blastoise has-text-weight-bold has-text-white">
      <div class="card-image">
        <div class="card-image-container">
          <img src="../../static/blastoise.png"/>
        </div>
      </div>
      <div class="card-content has-text-centered">
        <div class="main">
          <div class="title has-text-white">Blastoise</div>
          <div class="hp">hp 79</div>
        </div>
        <div class="stats columns is-mobile">
          <div class="column">&#x1f4a7;<br>
            <span class="tag is-light">Type</span>
          </div>
          <div class="column center-column">223 lbs<br>
            <span class="tag is-light">Weight</span>
          </div>
          <div class="column">1.6 m<br>
            <span class="tag is-light">Height</span>
          </div>
        </div>
      </div>
    </div>
  `
};

//! Card #3
const VenusaurCard = {
  name: "venusaur-card",
  template: `
    <div class="card card--venusaur has-text-weight-bold has-text-white">
      <div class="card-image">
        <div class="card-image-container">
          <img src="../../static/venusaur.png"/>
        </div>
      </div>
      <div class="card-content has-text-centered">
        <div class="main">
          <div class="title has-text-white">Venusaur</div>
          <div class="hp hp-venusaur">hp 80</div>
        </div>
        <div class="stats columns is-mobile">
          <div class="column">&#x1f343;<br>
            <span class="tag is-danger">Type</span>
          </div>
          <div class="column center-column">220 lbs<br>
            <span class="tag is-danger">Weight</span>
          </div>
          <div class="column">2.0 m<br>
            <span class="tag is-danger">Height</span>
          </div>
        </div>
      </div>
    </div>
  `
};

//! Router Paths
const routes = [
  { path: '/', component: CharizardCard },
  { path: '/charizard', component: CharizardCard },
  { path: '/blastoise', component: BlastoiseCard },
  { path: '/venusaur', component: VenusaurCard }
];

//! ROUTER Components
// The reserved < component > element will render whatever component the is attribute is bound to.Above, we’ve attached the is attribute to a currentView data property that simply maps to the CharizardCard component.As of now, our application resembles the starting point by displaying CharizardCard regardless of what the URL route is.

// In the data function, we’re now instantiating currentView with an empty object.In the created() hook, we’re using JavaScript’s native find() method to return the first object from routes that matches route.path === window.location.pathname.We can then get the component with object.component(where object is the returned object from find()).

// Inside a browser environment, window.location is a special object containing the properties of the browser’s current location.We grab the pathname from this object which is the path of the URL.

// At this stage; we'll be able to see the different Pokémon Card components based on the state of our browser URL!
const View = {
  name: 'router-view',
  template: `<component :is="currentView"></component>`,
  data() {
    return {
      currentView: {}
    }
  },
  created() {
    if (this.getRouteObject() === undefined) {
      this.currentView = {
        template: `
          <h3 class="subtitle has-text-white">
            Not Found :(. Pick a Pokémon from the list below!
          </h3>
        `
      };
    } else {
      this.currentView = this.getRouteObject().component;
    }

    // Event listener for link navigation
    EventBus.$on('navigate', () => {
      this.currentView = this.getRouteObject().component;
    });
  },
  methods: {
    getRouteObject() {
      return routes.find(
        route => route.path === window.location.pathname
      );
    }
  }
};

//! LINK Route
const Link = {
  name: 'router-link',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  template: `<a @click="navigate" :href="to">{{ to }}</a>`,
  methods: {
    navigate(evt) {
      evt.preventDefault();
      window.history.pushState(null, null, this.to);
      EventBus.$emit("navigate"); 
    }
  }
};

//! PARENT Component
const App = {
  name: "App",
  template: `
    <div class="container">
      <div class="pokemon">
        <router-view></router-view>
  
        <div class="pokemon-links has-text-centered">
          <router-link to="/charizard"></router-link>
          <router-link to="/blastoise"></router-link>
          <router-link to="/venusaur"></router-link>
        </div>
      </div>
    </div>
  `,
  components: {
    "router-view": View,
    "router-link": Link
  }
};

export default App;
