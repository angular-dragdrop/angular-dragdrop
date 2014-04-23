#Angular-DragDrop

Angular-DragDrop is a native HTML5 Drag and Drop directive written in pure Angular with no dependency on Jquery. 

This is based on the work done by Jason Turim. While this [blog post](http://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop/) was the inspiration for creating a native Drag and Drop solution, the intention was to create something that was more generic. 

This implementation is mainly different from the one posted in the blog in the following areas : 

1. Angular-DragDrop does not create an isolate scope. This has huge benefits when it comes to working with other directives. **NOTE :** It also does not pollute the scope with any variables or functions.

2. It does not depend on any kind of an ID attribute ( being either present or generated on the fly ). 

3. It allows one to create channels on which different drag and drop directive combinations can work on in the same page ( more on this later ) . 

Pull requests are welcome.

[Documentation](http://ganarajpr.github.io/angular-dragdrop/)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ganarajpr/angular-dragdrop/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

