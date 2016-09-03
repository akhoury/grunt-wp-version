'use strict';

var fs = require('fs');
var crypto = require('crypto');

module.exports = function(grunt) {
    grunt.registerTask('version', 'Set the versions for enqueued CSS/JS', function() {
        var options = this.options({
            file: '',
            js: '',
            css: ''
        });

        var prefix = '___';
        var cssPostfix = '___stylish';
        var jsPostfix = '___scriptish';

        var cssPattern = new RegExp(prefix + '(\\\w*)' + cssPostfix, 'g');
        var jsPattern = new RegExp(prefix + '(\\\w*)' + jsPostfix, 'g');

        var scriptsPhp = options.file;

        var cssHash = md5(options.css) || (+new Date);
        var jsHash = md5(options.js) || (+new Date);

        var content = grunt.file.read(scriptsPhp);

        content = content
            .replace(cssPattern, prefix + cssHash + cssPostfix)
            .replace(jsPattern, prefix + jsHash + jsPostfix);

        grunt.file.write(scriptsPhp, content);
        grunt.log.writeln('"' + scriptsPhp + '" updated with new CSS/JS versions.');
    });

    var md5 = function(filepath) {
        var hash = crypto.createHash('md5');
        hash.update(fs.readFileSync(filepath));
        grunt.log.write('Versioning ' + filepath + '...').ok();
        return hash.digest('hex');
    };
};
