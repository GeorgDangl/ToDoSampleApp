(function (global) {
  System.config({
    // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
    transpiler: 'ts',
    typescriptOptions: {
      // Copy of compiler options in standard tsconfig.json
      "target": "es5",
      "module": "commonjs",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "lib": ["es2015", "dom"],
      "noImplicitAny": true,
      "suppressImplicitAnyIndexErrors": true
    },
    meta: {
      'typescript': {
        "exports": "ts"
      }
    },
    paths: {
      // paths serve as alias
      'npm:': 'https://unpkg.com/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core@2.4.10/bundles/core.umd.js',
      '@angular/core/testing': 'npm:@angular/core@2.4.10/bundles/core-testing.umd.js',
      '@angular/common': 'npm:@angular/common@2.4.10/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler@2.4.10/bundles/compiler.umd.js',
      '@angular/compiler/testing': 'npm:@angular/compiler@2.4.10/bundles/compiler-testing.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser@2.4.10/bundles/platform-browser.umd.js',
      '@angular/platform-browser/testing': 'npm:@angular/platform-browser@2.4.10/bundles/platform-browser-testing.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.4.10/bundles/platform-browser-dynamic.umd.js',
      '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic@2.4.10/bundles/platform-browser-dynamic-testing.umd.js',
      '@angular/http': 'npm:@angular/http@2.4.10/bundles/http.umd.js',
      '@angular/http/testing': 'npm:@angular/http@2.4.10/bundles/http-testing.umd.js',
      '@angular/router': 'npm:@angular/router@3.4.10/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms@2.4.10/bundles/forms.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs@5.0.1',
      'ts':                        'npm:plugin-typescript@7.0.5/lib/plugin.js',
      'typescript':                'npm:typescript@2.2.1/lib/typescript.js',

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });

})(this);