'use strict';

var
	ko = require('knockout'),

	App = require('%PathToCoreWebclientModule%/js/App.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CMobileAppsSettingsPaneView()
{
	this.credentialsHintText = App.mobileCredentialsHintText;
	
	this.sAppPath = UrlUtils.getAppPath();
	
	this.oSettings = Settings;
}

CMobileAppsSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_MobileAppsSettingsPaneView';

module.exports = new CMobileAppsSettingsPaneView();
