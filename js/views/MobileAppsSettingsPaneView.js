'use strict';

var
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),

	App = require('%PathToCoreWebclientModule%/js/App.js'),

	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CMobileAppsSettingsPaneView()
{
	this.sAppPath = UrlUtils.getAppPath();

	this.bShowMailIosApp = Settings.ShowMailIosApp && Settings.MailIosAppLink !== '';
	this.sMailIosApp = Settings.MailIosAppLink;
	this.bShowMailAndroidApp = Settings.ShowMailAndroidApp && Settings.MailAndroidAppLink !== '';
	this.sMailAndroidApp = Settings.MailAndroidAppLink;
	this.bShowMailSection = this.bShowMailIosApp || this.bShowMailAndroidApp;

	this.bShowFilesAndroidApp = Settings.ShowFilesAndroidApp && Settings.FilesAndroidAppLink !== '';
	this.sFilesAndroidAppLink = Settings.FilesAndroidAppLink;
	this.bShowFilesIosApp = Settings.ShowFilesIosApp && Settings.FilesIosAppLink !== '';
	this.sFilesIosAppLink = Settings.FilesIosAppLink;
	this.bShowFilesWinApp = Settings.ShowFilesWinApp && Settings.FilesWinAppLink !== '';
	this.sFilesWinAppLink = Settings.FilesWinAppLink;
	this.bShowFilesSection = this.bShowFilesAndroidApp || this.bShowFilesIosApp || this.bShowFilesWinApp;
}

CMobileAppsSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_MobileAppsSettingsPaneView';

module.exports = new CMobileAppsSettingsPaneView();
