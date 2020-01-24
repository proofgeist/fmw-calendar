export function init(booter, optionalDefaultProps = null) {
  if (window.fmw) {
    window.fmw = {};
  }
  window.fmw = {
    getInitialProps: function() {
      return window.__initialProps__;
    }
  };

  //
  // if we pass in optional defaults use them
  if (optionalDefaultProps) return booter(optionalDefaultProps);

  //
  // if we have merged in initialProps use them to boot the widget
  if (window.__initialProps__ !== "__PROPS__") {
    try {
      window.__initialProps__ = JSON.parse(window.__initialProps__);
    } catch (error) {}

    booter(window.__initialProps__);
  } else {
    //
    //
    // we haven't merged so install loadInitialProps method for FM to use
    window.loadInitialProps = function(props) {
      try {
        props = JSON.parse(props);
      } catch (error) {}
      // boot the widget with those props
      window.__initialProps__ = props;
      booter(props);
    };
  }
}
