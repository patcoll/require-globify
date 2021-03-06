var fs = require('fs');
var browserify = require('browserify');
var through = require('through2');
var globRequireTransform = require('./../index');

describe('basic glob replacement', function() {
	it('should have both test tokens when bundled', function(done) {

		var data = '';
		browserify({
			entries: require.resolve('./basic/main.js')
		}).transform(globRequireTransform).bundle().pipe(through(function(buf, enc, cb) {
			data += buf;
			cb();
		}, function(cb) {
			var err;
			if (!(data.indexOf('test token1') !== -1 && data.indexOf('test token1') !== -1)) {
				err = new Error('expected the bundle to include both test tokens');
			}
			if (!(data.indexOf('test token3') === -1 && data.indexOf('test token4') === -1)) {
				err = new Error('expected the bundle to NOT include commented out files');
			}

			cb();
			done(err);
		}));
	});

	it('should not include itself when glob expression includes itself', function(done) {
		var data = '';
		browserify({
			entries: require.resolve('./basic/self-exclusion/module.js')
		}).transform(globRequireTransform).bundle().pipe(through(function(buf, enc, cb) {
			data += buf;
			cb();
		}, function(cb) {
			var err;
			if (data.indexOf('module.js') !== -1) {
				err = new Error('expected this require call to be skipped');
			}

			cb();
			done(err);
		}));
	});

});

