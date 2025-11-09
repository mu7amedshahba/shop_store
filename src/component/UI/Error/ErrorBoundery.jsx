
import React from 'react';


export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold">Something went wrong.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}



// class ErrorBoundary extends React.Component{
//   constructor(props) {
//     super(props) ;
//     this.state  = {hasError : false}
//   }

//   static getDrivenStateFromError(error) {
//     return {hasError : false}
//   }

//   componentDidCatch(error,errorInfo) {
//     console.log(`Boundary Error ${error } -  ${errorInfo}`)
//     return this.prop.children
//   }

// }

// export default ErrorBoundary