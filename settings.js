var merge = require('merge');

var settings = module.exports = {};

function read_settings(filename) {
  var fs = require('fs');
  var settings_from_file = JSON.parse(fs.readFileSync(filename, 'utf8'));
  return settings_from_file
}

var settings_from_file = read_settings('settings.json');
settings = merge(settings, settings_from_file);

module.exports = settings;