/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

Vtiger_Detail_Js("IStorages_Detail_Js", {}, {
	//It stores the IStorages Hierarchy response data
	hierarchyResponseCache: {},
	/*
	 * function to get the IStoragesHierarchy response data
	 */
	getHierarchyResponseData: function (params) {
		var thisInstance = this;
		var aDeferred = jQuery.Deferred();

		//Check in the cache
		if (!(jQuery.isEmptyObject(thisInstance.hierarchyResponseCache))) {
			aDeferred.resolve(thisInstance.hierarchyResponseCache);
		} else {
			AppConnector.request(params).then(
					function (data) {
						console.log(data);
						//store it in the cache, so that we dont do multiple request
						thisInstance.hierarchyResponseCache = data;
						aDeferred.resolve(thisInstance.hierarchyResponseCache);
					}
			);
		}
		return aDeferred.promise();
	},
	/*
	 * function to display the IStorages Hierarchy response data
	 */
	displayHierarchyResponseData: function (data) {
		var callbackFunction = function (data) {
			app.showScrollBar(jQuery('#hierarchyScroll'), {
				height: '300px',
				railVisible: true,
				size: '6px'
			});
		}
		app.showModalWindow(data, function (data) {
			if (typeof callbackFunction == 'function' && jQuery('#hierarchyScroll').height() > 300) {
				callbackFunction(data);
			}
		});
	},
	getDeleteMessageKey: function () {
		return 'LBL_RELATED_RECORD_DELETE_CONFIRMATION';
	},
	/**
	 * Number of records in hierarchy
	 * @license licenses/License.html
	 * @package YetiForce.Detail
	 * @author Radosław Skrzypczak <r.skrzypczak@yetiforce.com>
	 */
	registerHierarchyRecordCount: function () {
		var hierarchyButton = $('.detailViewTitle .hierarchy');
		if (hierarchyButton.length) {
			var params = {
				module: app.getModuleName(),
				action: 'RelationAjax',
				record: app.getRecordId(),
				mode: 'getHierarchyCount',
			}
			AppConnector.request(params).then(function (response) {
				if (response.success) {
					$('.detailViewTitle .hierarchy').append(' <span class="badge">' + response.result + '</span>');
				}
			});
		}
	},
	registerShowHierarchy: function () {
		var thisInstance = this;
		var hierarchyButton = $('.detailViewTitle');
		var url = "index.php?module=IStorages&view=Hierarchy&record=" + app.getRecordId();
		hierarchyButton.on('click', '.detailViewIcon', function (e) {
			thisInstance.getHierarchyResponseData(url).then(function (data) {
				thisInstance.displayHierarchyResponseData(data);
			});
		});
	},
	registerEvents: function () {
		this._super();
		this.registerHierarchyRecordCount();
		this.registerShowHierarchy();
	}
});
