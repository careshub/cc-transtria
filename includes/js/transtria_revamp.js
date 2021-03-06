
/**** Doc to hold revamp'd javascript **/

function clickListen(){

	//when clicking on the main tabs..
	jQuery('#main_tabs label.main_tab_label').on("click", main_tabber ); 
	
	//when clicking on the subpopulations tabs..
	jQuery('#sub_pops_tabs label.subpops_tab_label').on("click", sub_pops_tabber ); 
	
	//when clicking on the citation info tabs
	jQuery('#citation_tabs li').on( "click", citation_tab_toggle );
	
	//when clicking on the ea tabs
	jQuery('#effect_association_tabs li').on( "click", ea_tab_toggle );
	
	//get citation info
	jQuery("select#EndNoteID").on("change", get_citation_data);
	
	//show citation info
	jQuery("a.show_citation_data").on("click", show_citation_data);
	
	//show next indicator field
	jQuery('.show_indicator_field').on("click", next_indicator_field );
	
	//show next indicator field
	jQuery('.show_outcomes_field').on("click", next_outcomes_assessed_field );
	
	//load in selected study
	jQuery("a#load_this_study").on("click", load_selected_study );
	
	//load in selected study
	jQuery("a#start_new_study").on("click", function(){
		//construct url
		var redirectTo = transtria_ajax.study_home;
		//aaand, redirect
		window.location.replace( redirectTo );
	});
	
	//save selected study
	jQuery("a.save_study").on("click", save_study );

	//reminder messages on results page
	jQuery("#validatorstoptime, #abstractorstoptime").on("change", function() {
		stop_time_validate();
	});
	//TODO: restrict options in EA tabs based on intervention tabs.
	
	//TODO: ea direction!
	//jQuery("input[id$='_result_effect_association_direction']").
	jQuery("select[id$='_result_indicator_direction']").on( "change", ea_direction_calc );
	jQuery("select[id$='_result_outcome_direction']").on( "change", ea_direction_calc );
	
	
	//Confounders Type option - show if Confounders is YES, hide if NO
	confounder_type_show(); //on init
	jQuery("[name='confounders']").on("change", function(){
		confounder_type_show();
	});

	//IPE applicability question shows HR Subpops select
	ipe_hr_subpops_show();
	jQuery("[name='ipe_applicability_hr_pops']").on("change", function(){
		ipe_hr_subpops_show();
	});
	jQuery("#ipe_applicabilityhrpops_notreported").on("change", function(){
		ipe_hr_subpops_show();
	});

	//ESE oversampling question shows HR subpops select
	//ese_hr_subpops_show();
	//jQuery("[name='ese_oversampling']").on("change", function(){
	jQuery("[name$='_oversampling']").on("change", ese_hr_subpops_show );
	jQuery("[id$='_oversampling_notreported']").on("change", ese_hr_subpops_show );
	jQuery("[name$='_oversampling']").trigger("change" );
	jQuery("[id$='_oversampling_notreported']").trigger("change" );
	
	//if this 'not reported' is also jQuery('ese_oversampling_notreported') or jQuery('[name="ipe_applicability_hr_pops"]')
	//jQuery('[name="ese_oversampling_notreported"]').on("click", ese_hr_subpops_show);

	//Limit strategies on EA/results tab based on ones selected on intervention
	jQuery("#strategies").on("change", function(){
		strategy_limit_results(); 
	});
	//strategy_limit_results(); //hmm, not yet, multiselects take a while to set up, apparently

	
	//Add new ESE tabs
	//Nomore copying. //jQuery('#add-ese-tab').on("click", copy_ese_tab );
	jQuery('#add-ese-tab').on("click", create_ese_tab );
	
	//remove ese tabs
	jQuery('.remove_ese_tab').on("click", remove_ese_tab );
	
	//add new ea tab
	jQuery('a.add_ea_button').on("click", add_empty_ea_tab);
	
	//copy EA tabs from dropdown
	jQuery('.ea_copy_tab_button').on("click", copy_ea_tab );
	
	//when clicking 'not reported', unselected related radio fields
	jQuery('.not_reported_clear').on("click", uncheck_not_reported_related_fields);
	
	//when clicking on a radio with a corresponding 'not reported' attribute, selecting radio fields unclicks 'not reported' checkbox
	jQuery('input[data-notreported_id]').on("click", uncheck_not_reported_checkboxes);
	
	//other populations checkbox should enable other populations description (textarea). 
	//TODO: are we clearing anything?
	jQuery('.other_populations_textenable').on("click", other_populations_textarea_enable);
	
	//show/hide variables textarea if 'adjusted'/'crude' is selected: this is an EA thing, but Mel is sorting that listener out
	jQuery("input[name$='_result_type']").on("click", show_adjusted_variables );
	
	//if other indicators added/destroyed/changed, refactor indicators on ea tabs
	jQuery("[id^='other_intervention_indicators']").on( "change", other_indicators_to_dropdown );
	
	//if outcomes assessed added/destroyed/changed, refactor indicators on ea tabs
	jQuery("[id^='other_intervention_outcomes_assessed']").on( "change", other_outcomes_assessed_to_dropdown );
		
	//what if a click on the Results tab triggers a one-time ea_clickListen (assuming multiselects are in place by then? Can we assume that?)
	//jQuery('label.results_tab_label').on( "click", ea_clickListen );
	
	//certain measures have up to 10 text boxes associated with them
	jQuery("[id$='_result_measures']").on( "change", measures_extra_textboxes );
	
	
	jQuery("[id$='_result_indicator']").on( "change", function(){
		ea_indicators_add_strategies_directions( jQuery(this) );
	});
	
}

//hmm, not using?
function ea_clickListen(){

	//initialize intervention indicator limiter 
	var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
	for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
		//our current ea indicator tab
		intervention_indicator_limiter( jQuery('#ea_' + tabCounter + '_result_indicator') );
		
	} 
	//update our template, as well
	//intervention_indicator_limiter( jQuery('#ea_template_result_indicator') );
	
	//TODO: test if incoming object/trigger is this
	//jQuery('label.results_tab_label').off( "click", ea_clickListen );

}



//function setup_multiselect(comp) {
function setup_multiselect() {

	//console.log( ms_id_array );
	jQuery( function(){

		jQuery(".general-multiselect").multiselect({
			header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			//selectedList: 4, 
			close: function( event, ui ){
				//multiselect_listener( jQuery(this) );
			}
		}); 
		
		//ea multiselects
		jQuery(".ea_multiselect").multiselect({
			header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			beforeopen: function(event, ui){
				//if we're on the indicators multiselect
				//if( jQuery(this).attr('id')
			//	console.log( this );
				//intervention_indicator_limiter( jQuery(this ) );
			},
			//selectedList: 4, 
			close: function( event, ui ){
				//multiselect_listener( jQuery(this) );
				//console.log( this );
			}
		}); 
		
		jQuery("#state_setting").multiselect({
			header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			checkAllText: 'Select all states and territories',
			uncheckAllText: 'Deselect all states and territories',
			close: function( event, ui){

			}
		});
		
		jQuery("#searchtooltype").multiselect({
			header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			checkAllText: 'Select all',
			uncheckAllText: 'Deselect all',
			close: function( event, ui){

			}
		});
		//searchtooltype..why is this special?
		
		jQuery('#intervention_indicators').multiselect({
		
			close : function (e) {
				var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
				for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
					//our current ea indicator tab
					intervention_indicator_limiter( jQuery('#ea_' + tabCounter + '_result_indicator') );
					//ea_indicators_add_strategies_directions( jQuery('#ea_' + tabCounter + '_result_indicator') );
				} 
				//update our template, as well
				intervention_indicator_limiter( jQuery('#ea_template_result_indicator') );
				outcomes_assessed_limiter( jQuery('#ea_template_result_outcome_accessed') );
				//ea_indicators_add_strategies_directions( jQuery('#ea_template_result_indicator') );
           }
		});

		jQuery('#intervention_outcomes_assessed').multiselect({
		
			close : function (e) {
				var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
				for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
					//our current ea indicator tab
					outcomes_assessed_limiter( jQuery('#ea_' + tabCounter + '_result_outcome_accessed') );
				} 
				//update our template, as well
				outcomes_assessed_limiter( jQuery('#ea_template_result_outcome_accessed') );
           }
		});
		
		jQuery("[id$=_ability_status]").multiselect({
			header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			checkAllText: 'Select all',
			close: ability_status_limiter
		});
		
		jQuery.each( jQuery('.general-multiselect'), function(){
		
			jQuery(this).multiselect("uncheckAll");
		
		});
	});
	

/*
	var ms=selector(comp.id);
 
	ms.find('option').remove();
	ms.attr('multiple', 'multiple') // add multiple attribute just in case it isn't there (or set incorrectly)

     for(var j=0; j < comp.options.length; j++) {
        var _o=jQuery("<option>")
        _o.val(comp.options[j].value)
        _o.text(comp.options[j].text)

        if (comp.options[j].selected==true) _o.attr("selected", "selected");
                  
        _o.appendTo(ms);
     }

     try {ms.multiselect('destroy')}catch(e){}
     
	if( comp.id == "state_setting"){
		ms.multiselect(
			{header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			checkAllText: 'Select all states',
			uncheckAllText: 'Deselect all states',
			close: function( event, ui){

			}
		})
	} else if( comp.id == "searchtoolname" || comp.id == "searchtooltype"){
		ms.multiselect(
			{header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			checkAllText: 'Select all',
			uncheckAllText: 'Deselect all',
			close: function( event, ui){

			}
		})
	} else if ( comp.id == "intervention_indicators" ) {
		ms.multiselect(
			{header: true,
			position: {my: 'left bottom', at: 'left top'},
			selectedText: '# of # checked',
			close: function( event, ui ){
				multiselect_selected_display( "intervention_indicators", "intervention_indicators_display");
			}
		})

	} else {
		ms.multiselect({header: 'Choose option(s)',
                     position: {my: 'left bottom', at: 'left top'},
                     selectedText: '# of # checked',
		     close: function( event, ui ){
				multiselect_listener( jQuery(this) );
		     }
     	        })
        }
		
*/
}

//sets up main tabs
function main_tabber( ){
	
	//console.log( jQuery(this) ); //looks at label
	var incoming = jQuery(this);
	
	//hide all subpops content
	//jQuery('.main_content').hide();
	jQuery('.main_content').addClass('noshow');
	
	var which_pop = incoming.data("whichmaintab");
	var which_content = which_pop + '_content';
	
	//add selected class
	jQuery('label.main_tab_label').removeClass('active');
	incoming.addClass('active');

	jQuery("#" + which_content + '.main_content').removeClass('noshow');

	//adjust the height of what we are seeing
	adjust_form_height();
};

//sets up tabs for subpops 
function sub_pops_tabber( ){
	
	//console.log( jQuery(this) ); //looks at label
	var incoming = jQuery(this);
	
	//hide all subpops content
	jQuery('.subpops_content').hide();
	
	var which_pop = incoming.data("whichpop");
	var which_content = which_pop + '_content';
	
	//add selected class
	jQuery('label.subpops_tab_label').removeClass('active');
	incoming.addClass('active');

	jQuery('.subpops_content.' + which_content).show();

};


//tabs toggle for citation info (inner tabs)
function citation_tab_toggle(){

	var whichtab = jQuery(this).find('a').data("whichtab");
	
	//fade out all, remove active class from all l
	jQuery("tr.endnote_citation_data #citation_tabs .one_citation_tab").fadeOut();
	jQuery("tr.endnote_citation_data #citation_tabs ul li").removeClass("active");
	
	jQuery("tr.endnote_citation_data #citation_tabs #" + whichtab).fadeIn();
	jQuery(this).addClass("active");
	//console.log(whichtab);
	
}

//tabs toggle for effect associations
function ea_tab_toggle(){

	var whichtab = jQuery(this).find('label').data("whichea");
	
	//fade out all, remove active class from all l
	jQuery("#effect_association_tabs .one_ea_tab").fadeOut();
	jQuery("#effect_association_tabs ul li label").removeClass("active");
	
	jQuery("#effect_association_tabs #effect_association_tab_" + whichtab).fadeIn();
	jQuery(this).find('label').addClass("active");
	//console.log(whichtab);
	
}

//show additional indicator fields (up to 10, numbered weird because legacy)
function next_indicator_field(){

	jQuery(this).hide();
	
	var current_parent_tr = jQuery(this).parents('tr');
	var current_other_ind = current_parent_tr.find('.other_indicator').attr('data-which_other');
	//console.log( current_other_ind );
	
	//what's next?
	if( parseInt( current_other_ind ) < 10 ){
	
		var next_ind = parseInt( current_other_ind ) + 1;
		
		var new_tr = '<tr class="additional_indicators"><td></td><td><label>Other Intervention Indicator ' + next_ind + ':</label></td>';
		new_tr += '<td><input type="text" id="other_intervention_indicators' + next_ind +'" class="studies_table other_indicator" data-which_other="' + next_ind + '"></input></td>';
		new_tr += '<td><a class="show_indicator_field button">+</a></td></tr>';
		
		//insert new tr after parent tr
		jQuery( new_tr ).insertAfter( current_parent_tr );
	}
	
	//reset the listeners
	jQuery('.show_indicator_field').off("click", next_indicator_field );
	jQuery('.show_indicator_field').on("click", next_indicator_field );
	
	//if other indicators added/destroyed/changed, refactor indicators on ea tabs
	jQuery("[id^='other_intervention_indicators']").off( "change", other_indicators_to_dropdown );
	jQuery("[id^='other_intervention_indicators']").on( "change", other_indicators_to_dropdown );
	
}

//show additional indicator fields (up to 10, numbered weird because legacy)
function next_outcomes_assessed_field(){

	jQuery(this).hide();
	
	var current_parent_tr = jQuery(this).parents('tr');
	var current_other_ind = current_parent_tr.find('.other_outcome').attr('data-which_other');
	//console.log( current_other_ind );
	
	//what's next?
	if( parseInt( current_other_ind ) < 10 ){
	
		var next_ind = parseInt( current_other_ind ) + 1;
		
		var new_tr = '<tr class="additional_outcomes"><td></td><td><label>Other Outcomes Assessed ' + next_ind + ':</label></td>';
		new_tr += '<td><input type="text" id="other_intervention_outcomes_assessed' + next_ind +'" class="studies_table other_outcome" data-which_other="' + next_ind + '"></input></td>';
		new_tr += '<td><a class="show_outcomes_field button">+</a></td></tr>';
		
		//insert new tr after parent tr
		jQuery( new_tr ).insertAfter( current_parent_tr );
	}
	
	//reset the listeners
	jQuery('.show_outcomes_field').off("click", next_outcomes_assessed_field );
	jQuery('.show_outcomes_field').on("click", next_outcomes_assessed_field );
	
	//if other indicators added/destroyed/changed, refactor indicators on ea tabs
	jQuery("[id^='other_intervention_outcomes_assessed']").off( "change", other_outcomes_assessed_to_dropdown );
	jQuery("[id^='other_intervention_outcomes_assessed']").on( "change", other_outcomes_assessed_to_dropdown );
	
}

//other indicators created/destroyed requires a re-factor of ea tab indicators
function other_indicators_to_dropdown(){

	//how many ea tabs do we have?
	var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
	
	for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
		//our current ea indicator tab
		intervention_indicator_limiter( jQuery('#ea_' + tabCounter + '_result_indicator') );
	} 
	//update our template, as well
	intervention_indicator_limiter( jQuery('#ea_template_result_indicator') );

}

function other_outcomes_assessed_to_dropdown(){

	//how many ea tabs do we have?
	var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
	
	for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
		//our current ea indicator tab
		outcomes_assessed_limiter( jQuery('#ea_' + tabCounter + '_result_outcome_accessed') );
	} 
	//update our template, as well
	outcomes_assessed_limiter( jQuery('#ea_template_result_outcome_accessed') );

}

//limit options for intervention components for ea tabs (based on #intervention_indicators)
function intervention_indicator_limiter( incoming ){

	//this should be incoming..
	var which_ea_select = incoming;
	
	//on the intervention tab - this is the original 
	var original_select = jQuery('#intervention_indicators').multiselect('getChecked');
	
	//get the selected on the EA results subtab (EA tab)
	var _selectSelected = which_ea_select.multiselect('getChecked');
	selected_array = [];
	
	//get the 'other_indicators' hidden value on this ea tab (to be parsed)
	var selected_other_ind_value = which_ea_select.parents('.one_ea_tab').find('.other_indicators').val();
	var selected_other_ind_array = selected_other_ind_value.split(',');

	
	//make array for selected options
	_selectSelected.each( function() {
		valHolder = jQuery(this).val();
		selected_array.push(valHolder);
	});
	
	
	var _ea_options = which_ea_select.find('option');

	var _values = [];
	for ( var i=0; i < original_select.length; i++ ) {
		_values.push( original_select[i].value );
	}

	//remove all options from ea_option array
	which_ea_select.find('option').remove();


	//seriously, Billy, USE A COMMENT ONCE IN A WHILE WHAT ARE YOU DOING??
	/*_ea_values=[];
	for ( var i=0; i < _ea_options.length; i++ ) {
		_ea_values.push(_ea_options[i].value);
	}*/

	//populate with the selected items from intervention_outcomes_assessed multiselect, selecting if already selected
	for (var i=0; i < original_select.length; i++) {
		//if ( _ea_values.indexOf( original_select[i].value ) == -1) {
		if( jQuery.inArray( original_select[i].value, selected_array ) != "-1" ) {
			which_ea_select.append('<option value="' + original_select[i].value +'" selected="selected">' + original_select[i].title + "</option>");
		} else {
			which_ea_select.append('<option value="' + original_select[i].value +'">' + original_select[i].title + "</option>");
		}
	}
	
	//populate ALSO with any 'other' indicators (added in Intervention/Partnerships)
	var other_indicators = jQuery('input.other_indicator');
	
	jQuery.each( other_indicators, function(){

		//if we HAVE a value
		if( jQuery(this).val().length > 0 ){  
			//append to indicators on ea tabs
			if( jQuery(this).attr("data-which_other") == 1 ){
				//legacy id for first indicator
				var id_value = 'other_intervention_indicators';
			} else {
				var id_value = 'other_intervention_indicators' + jQuery(this).attr("data-which_other");
			}
			
			if( jQuery.inArray( id_value, selected_other_ind_array ) != "-1" ){
				which_ea_select.append('<option class="other_indicator" value="' + id_value + '" selected="selected">' + jQuery(this).val() + "</option>");
			} else {
				which_ea_select.append('<option class="other_indicator" value="' + id_value + '">' + jQuery(this).val() + "</option>");
			}
		
		}
	});
	
	//refresh this multiselect to show changed options
	try { 
		which_ea_select.multiselect('refresh');
	} catch(e){
		console.log(e);
	}
}

//limit options for outcomes assessed for ea tabs (based on #intervention_outcomes_assessed)
function outcomes_assessed_limiter( incoming ){

	//this should be incoming..
	//var which_ea_select = jQuery('#ea_template_result_indicator');
	var which_ea_select = incoming;
	
	//on the intervention tab - this is the original 
	var original_select = jQuery('#intervention_outcomes_assessed').multiselect('getChecked');

	//get the selected on the EA results subtab (EA tab)
	var _selectSelected = which_ea_select.multiselect('getChecked');
	selected_array = [];
	
	//get the 'other_outcomes_assessed' hidden value on this ea tab (to be parsed)
	var selected_other_out_value = which_ea_select.parents('.one_ea_tab').find('.other_outcomes').val();
	var selected_other_out_array = selected_other_out_value.split(',');
	
	//make array for selected options
	_selectSelected.each( function() {
		valHolder = jQuery(this).val();
		selected_array.push(valHolder);
	});
	
	var _ea_options = which_ea_select.find('option');

	var _values = [];

	for ( var i=0; i < original_select.length; i++ ) {
		_values.push(original_select[i].value);
	}

	//remove all options from ea_option array
	which_ea_select.find('option').remove();
	
	//remove all options from ea_option array
	/*for ( var i=_ea_options.length-1; i >= 0; i-- ) {
		if (_values.indexOf(_ea_options[i].value) == -1) {
			_ea_options[i].remove();
		}
	} */
	
	//populate with the selected items from intervention_outcomes_assessed multiselect, selecting if already selected
	for (var i=0; i < original_select.length; i++) {
		//if ( _ea_values.indexOf( original_select[i].value ) == -1) {
		if( jQuery.inArray( original_select[i].value, selected_array ) != "-1" ) {
			which_ea_select.append('<option value="' + original_select[i].value +'" selected="selected">' + original_select[i].title + "</option>");
		} else {
			which_ea_select.append('<option value="' + original_select[i].value +'">' + original_select[i].title + "</option>");
		}
	}
	
	//populate ALSO with any 'other' indicators (added in Intervention/Partnerships)
	var other_outcomes = jQuery('input.other_outcome');
	
	jQuery.each( other_outcomes, function(){

		//if we HAVE a value
		if( jQuery(this).val().length > 0 ){  
			//append to indicators on ea tabs
			if( jQuery(this).attr("data-which_other") == 1 ){
				//legacy id for first indicator
				var id_value = 'other_intervention_outcomes_assessed';
			} else {
				var id_value = 'other_intervention_outcomes_assessed' + jQuery(this).attr("data-which_other");
			}
			
			if( jQuery.inArray( id_value, selected_other_out_array ) != "-1" ){
				which_ea_select.append('<option class="other_outcome" value="' + id_value + '" selected="selected">' + jQuery(this).val() + "</option>");
			} else {
				which_ea_select.append('<option class="other_outcome" value="' + id_value + '">' + jQuery(this).val() + "</option>");
			}
		
		}
	});
	
	/*
	_ea_values=[];
	for (var i=0; i < _ea_options.length; i++) {
		_ea_values.push(_ea_options[i].value);
	}

	//populate with the selected items from intervention_outcomes_assessed multiselect
	for (var i=0; i < original_select.length; i++) {
		if (_ea_values.indexOf( original_select[i].value ) == -1) {
			which_ea_select.append('<option value="' + original_select[i].value +'">' + original_select[i].title + "</option>");
		}
	}
	*/

	//refresh our dropdown
	try { 
		which_ea_select.multiselect('refresh');
	} catch(e){
		console.log(e);
	}
}


//get endnote id citation info, for selected endnote id
function get_citation_data(){

	//what's the study id in the url?
	endnote_id = jQuery('#EndNoteID').val();
	
	//user messages
	var spinny = jQuery('.citation_spinny.spinny');
	//var usrmsg = jQuery('.citation_info_messages .usr-msg');
	//var usrmsgshell = jQuery('.citation_info_messages');

	//ajax data
	var ajax_action = 'get_citation_info';
	var ajax_data = {
		'action': ajax_action,
		'endnote_id' : endnote_id,
		'transtria_nonce' : transtria_ajax.ajax_nonce
	};
	
	if( ( endnote_id !== undefined ) && ( endnote_id !== "" ) ) {
		//Get data associate with this study
		jQuery.ajax({
			url: transtria_ajax.ajax_url, 
			data: ajax_data, 
			type: "POST",
			dataType: "json",
			beforeSend: function() {
				//show user message and spinny
				//usrmsg.html("Loading Study ID: " + endnote_id );
				//usrmsgshell.fadeIn();
				spinny.fadeIn();
				
			}
		}).success( function( data ) {
			//console.log('success: ' + data);
			
			
			//TODO: send message if empty (directing user to add priority page?)
			if( data == "0" || data == 0 )  {
				//console.log('what');=
				return;
			} else {
			
			}
			var post_meat = data; // = JSON.parse(data);
			var processed_meat = {};
			var new_index_name = "";
			
			jQuery.each( post_meat, function( index, value ){
				//to make sure the indeces don't conflict w others on the form, add endnotes_ to each 
				new_index_name = "endnotes_" + index;
				processed_meat[ new_index_name ] = value;
				
				//console.log(new_index_name);
				
			});
			
			//now.. populate fields!
			jQuery.each( processed_meat, function( index, value ){
			
				// TODO: edit study function in php to return indexes = div ids
				selector_obj = jQuery("#" + index );
				
				if( selector_obj.length > 0 ){
					//update the (readonly) value
					selector_obj.html( value );
				
				}
				
				//other divs not indexed to match db
				if( index == "endnotes_accession-num" ){
					jQuery( "#accession-num" ).val( value );
				} else if ( index == "endnotes_remote-database-name" ){
					jQuery( "#remote-database-name" ).val( value );
				} else if ( index == "endnotes_remote-database-provider" ){
					jQuery( "#remote-database-provider" ).val( value );
				} 
				//top of study form info
				else if ( index == "endnotes_contributors_authors_author" ){
					jQuery( "#endnote_author" ).html( value );
				} else if ( index == "endnotes_titles_title" ){
					jQuery( "#endnote_title" ).html( value );
				} else if ( index == "endnotes_dates_pub-dates_date" ){
					jQuery( "#endnote_dates" ).html( value );
				} else if ( index == "endnotes_dates_year" ){
					jQuery( "#endnote_dates_year" ).html( value );
				}
			
			});
			
		}).complete( function(data){
			//we're done!  Tell the user
			spinny.css("display", "none");
			//usrmsg.html("Study ID " + this_study_id + " loaded successfully!" );
			//usrmsgshell.fadeOut(6000);
			
			//refresh which phase this is
			var phase = get_phase_by_endnoteid( endnote_id );
			jQuery("#endnote_phase").html( phase );
			
		}).always(function() {
			//regardless of outcome, hide spinny
			//jQuery('.action-steps').removeClass("hidden");
		});
	}
}

//show/hide citation data
function show_citation_data(){

	var citation_div = jQuery('.endnote_citation_data');
	var citation_button_div = jQuery('a.show_citation_data');
	
	
	//are we showing or hiding
	if( citation_div.is(":hidden") ){
		citation_div.slideDown();
		citation_button_div.html("HIDE ENDNOTE CITATION DATA");
	} else {
		citation_div.slideUp();
		citation_button_div.html("SHOW ENDNOTE CITATION DATA");
	}
	

}

//returns phase by endnote id
function get_phase_by_endnoteid( which_endnoteid ){

	if( ( which_endnoteid > 501 ) && ( which_endnoteid < 1103 ) ){
		return "1";
	} else {
		return "2";
	}
}


//get current study info via ajax. TODO: rename this and next functions to make sense!
function get_current_study_info(){

	//what's the study id in the url?
	this_study_id = getURLParameter('study_id');
	
	//if study id not in current studies list, bounce!
	if( ( jQuery.inArray( parseInt( this_study_id ), transtria_ajax.all_studies ) == "-1" ) && ( this_study_id != undefined ) ){
		//update user message at top of page
		jQuery('.basic_info_messages .usr-msg').html('No Study ID ' + this_study_id + ' in Studies database (as specified in the url parameter).  Please contact CARES if you think this is in error.');
		jQuery('.basic_info_messages').show();
		return false;
	}
	
	//user messages
	var spinny = jQuery('.basic_info_messages .spinny');
	var usrmsg = jQuery('.basic_info_messages .usr-msg');
	var usrmsgshell = jQuery('.basic_info_messages');

	//ajax data
	var ajax_action = 'get_study_data';
	var ajax_data = {
		'action': ajax_action,
		'this_study_id' : this_study_id,
		'transtria_nonce' : transtria_ajax.ajax_nonce
	};
	
	if( ( this_study_id !== null ) && ( this_study_id > 0 ) ) {
		//Get data associate with this study
		jQuery.ajax({
			url: transtria_ajax.ajax_url, 
			data: ajax_data, 
			type: "POST",
			dataType: "json",
			beforeSend: function() {
				//show user message and spinny
				usrmsg.html("Loading Study ID: " + this_study_id );
				usrmsgshell.fadeIn();
				spinny.fadeIn();
				
			}
		}).success( function( data ) {
		
			//TODO: send message if empty (directing user to add priority page?)
			if( data == "0" || data == 0 )  {
				return;
			} 
			
			var post_meat = data['single']; // = JSON.parse(data);
			var pops_meat = data['population_single'];
			var ea_meat = data['ea'];
			var multi_meat = data['multiple'];
			var special_meat = data['special_data'];
			//console.log( multi_meat);	
			
			//add a ea tab shell for all the incoming ea tabs - should have been added in php already
			//jQuery.each( data['num_ea_tabs'], add_empty_ea_tab );
			for( var it = 0; it < data['num_ea_tabs']; it++){
				//add_empty_ea_tab();
			}
			//console.log( data['num_ea_tabs'] );
					
			//now.. populate fields!
			//single data (from studies db table)
			jQuery.each( post_meat, function(index, element) {
				
				//do we have an element div id w this index?  
				// TODO: edit study function in php to return indexes = div ids
				selector_obj = jQuery("#" + index );
				selector_obj_by_name = jQuery("input[name='" + index + "']");
				
				if( selector_obj.length > 0 ){
					
					//console.log( jQuery( selector_obj ) ) ;
					var current_val;
					//what is our selector type?
					if( selector_obj.is('select') ){
						//see if there's a matching option
						var children = selector_obj.children('option');
						//iterate through option values
						jQuery.each( children, function(){
							//what is current option value
							current_val = jQuery(this).val();
							current_val = current_val.trim(); //if whitespace because sometimes there is..*sigh*
							
							var int_trial = parseInt( current_val, 10 );
							//is it string or int? Sometimes there are both ... would that matter? 
							//	Mel doesn't think so since this is to test equality
							if ( isNaN( int_trial ) ){
								//we have strings
								if ( current_val == element ){
									jQuery(this).attr('selected','selected');
									return;
								}
							} else {
								
								if ( int_trial == parseInt( element, 10 ) ){
									jQuery(this).attr('selected','selected');
									return;
								}
							}
						
						
						});
						//console.log( index ); 
						//console.log( element ); 
					} else if ( selector_obj.is('input:text') || selector_obj.is('textarea') ){
						//easy-peasy
						selector_obj.val( element );
					
					} else if ( selector_obj.is('input:checkbox') ){
						if( element == "Y" ){
							selector_obj.attr("checked", "checked");
						}
					} 
				}
				
				//if we have inputs with name instead (radios), update those
				if( selector_obj_by_name.length ){
					if ( selector_obj_by_name.is('input:radio') ){
						//mark as checked whichever radio == element
						jQuery("input[name='" + index + "'][value='" + element + "']").prop('checked',true);
					} 
				}
												
			});
			
			//now handle incoming single popualation data
			jQuery.each( pops_meat, function( pop_type, pop_data ) {
				
				jQuery.each( pop_data, function( index, element ){
					//do we have an element div id w this index?  
					selector_obj = jQuery("#" + index );
					selector_obj_by_name = jQuery("input[name='" + index + "']");
					
					if( selector_obj.length > 0 ){
						
						//console.log( jQuery( selector_obj ) ) ;
						var current_val;
						//what is our selector type?
						if( selector_obj.is('select') ){
							//see if there's a matching option
							var children = selector_obj.children('option');
							//console.log( children );
							
							//iterate through option values
							jQuery.each( children, function(){
								//what is current option value
								current_val = jQuery(this).val();
								current_val = current_val.trim(); //if whitespace because sometimes there is..*sigh*
								
								var int_trial = parseInt( current_val, 10 );
								
								//is it string or int? Sometimes there are both ... would that matter? 
								//	Mel doesn't think so since this is to test equality
								if ( isNaN( int_trial ) ){
									//we have strings
									if ( current_val == element ){
										jQuery(this).attr('selected','selected');
										return;
									}
								} else {
									
									if ( int_trial == parseInt( element, 10 ) ){
										jQuery(this).attr('selected','selected');
										return;
									}
								}
							
							
							});
							//console.log( index ); 
							//console.log( element ); 
						} else if ( selector_obj.is('input:text') || selector_obj.is('textarea') ){
							//easy-peasy
							selector_obj.val( element );
						
						} else if ( selector_obj.is('input:checkbox') ){
							if( element == "Y" ){
								selector_obj.attr("checked", "checked");
							}
						} 
					}
					
					//if we have inputs with name instead (radios), update those
					if( selector_obj_by_name.length ){
						if ( selector_obj_by_name.is('input:radio') ){
							//mark as checked whichever radio == element
							jQuery("input[name='" + index + "'][value='" + element + "']").prop('checked',true);
						} 
					}
										
				});
				
			});
			
			
			//now handle incoming ea data
			jQuery.each( ea_meat, function( ea_num, ea_data) {
				
				jQuery.each( ea_data, function( index, element ){
					
					//do we have an element div id w this index?  
					selector_obj = jQuery("#" + index );
					//console.log( selector_obj );
					selector_obj_by_name = jQuery("input[name='" + index + "']");
					
					if( selector_obj.length > 0 ){
						
						//console.log( jQuery( selector_obj ) ) ;
						var current_val;
						//what is our selector type?
						if( selector_obj.is('select') ){
							//see if there's a matching option
							var children = selector_obj.children('option');
							//console.log( children );
							
							//iterate through option values
							jQuery.each( children, function(){
								//what is current option value
								current_val = jQuery(this).val();
								current_val = current_val.trim(); //if whitespace because sometimes there is..*sigh*
								
								var int_trial = parseInt( current_val, 10 );
								
								//is it string or int? Sometimes there are both ... would that matter? 
								//	Mel doesn't think so since this is to test equality
								if ( isNaN( int_trial ) ){
									//we have strings
									if ( current_val == element ){
										jQuery(this).attr('selected','selected');
										return;
									}
								} else {
									
									if ( int_trial == parseInt( element, 10 ) ){
										jQuery(this).attr('selected','selected');
										return;
									}
								}
							
							
							});
							//console.log( index ); 
							//console.log( element ); 
						} else if ( selector_obj.is('input:text') || selector_obj.is('textarea') ){
							//easy-peasy
							selector_obj.val( element );
						
						} else if ( selector_obj.is('input:checkbox') ){
							if( element == "Y" ){
								selector_obj.attr("checked", "checked");
							}
						} 
					}
					
					//if we have inputs with name instead (radios), update those
					if( selector_obj_by_name.length ){
						if ( selector_obj_by_name.is('input:radio') ){
							//mark as checked whichever radio == element
							jQuery("input[name='" + index + "'][value='" + element + "']").prop('checked',true);
						} 
					}
					
				});
				
			});
			
			console.log( 'pre multi' );
			//now handle the incoming multiple data
			console.log( jQuery.isPlainObject( multi_meat ) );
			if( jQuery.isPlainObject( multi_meat ) ){
				jQuery.each( multi_meat, function(index, element) {
					
					//do we have an element div id w this index?  
					// TODO: edit study function in php to return indexes = div ids
					selector_obj = jQuery("#" + index );
					//selector_obj_by_name = jQuery("input[name='" + index + "']");
					//console.log( selector_obj );
					if( selector_obj.length > 0 ){
						//mark child options of that value as 'selected'
						selector_obj.val( element ).prop("checked", true);
						//console.log( selector_obj );
					}
				});
			}
			
		}).complete( function(data){
		
		//have to handle the special data after everything else is loaded. Probs could do this in success after multi_meat gets processed
			var special_meat = data.responseJSON.special_data;
			
			//we're done!  Tell the user
			spinny.css("display", "none");
			usrmsg.html("Study ID " + this_study_id + " loaded successfully!" );
			usrmsgshell.fadeOut(6000);
			
			//refresh all our multiselects
			jQuery(".multiselect").multiselect("refresh");
			jQuery(".ea_multiselect").multiselect("refresh"); //these are special
			
			//refresh the endnote info
			get_citation_data();
			
			//refresh copytab dropdown options
			refresh_ea_copy_tab();
			
			//initialize ability status limiter
			ability_status_initialize();
			
			//field-specific limits
			strategy_limit_results();
			
			//ese_hr_subpops_show();
			jQuery("[name$='_oversampling']").trigger("change");
			jQuery("[id$='_oversampling_notreported']").trigger("change");

			ipe_hr_subpops_show();
			confounder_type_show();
			
			//initialize the intervention component limiter and outcomes assessed limiter
			var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
			for ( var tabCounter = 1; tabCounter <= num_current_tabs; tabCounter++ ) {
				//our current ea indicator tab
				intervention_indicator_limiter( jQuery('#ea_' + tabCounter + '_result_indicator') );
				outcomes_assessed_limiter( jQuery('#ea_' + tabCounter + '_result_outcome_accessed') );
				
				//make sure strategies and directions are added - //we now do this later
				ea_indicators_add_strategies_directions( jQuery('#ea_' + tabCounter + '_result_indicator') );
			} 
			
			//update our template, as well
			intervention_indicator_limiter( jQuery('#ea_template_result_indicator') );
			outcomes_assessed_limiter( jQuery('#ea_template_result_outcome_accessed') );
			
			
			//TODO: handle the special data (parse and put into strategy/direction drop downs
			jQuery.each( special_meat, function( ea_tab, v ) { //i = ea tab num, v = data
			
				//TODO: populate the strategies and directions for each ea tab
				//console.log( ea_tab );
				//console.log( v );
				if( v.indicators != undefined ){
					jQuery.each( v.indicators, function( ind_num, details ) {
						
						if( details.direction != undefined ){
							//find dropdown for direction, update value
							jQuery('.result_direction[data-this_ea_tab="' + ea_tab + '"][data-strategy_value="' + ind_num + '"]').val( details.direction );
							
						} 
						if( details.strategies != undefined ){
							jQuery.each( details.strategies, function( strategy_num, strategy_val ){
								//console.log( strategy_val );
								//find strategy dropdown, update value
								jQuery('[data-this_ea_tab="' + ea_tab + '"][data-strategy_value="' + ind_num + '"][data-strategy_num="' + strategy_num + '"]').val(strategy_val);
							});
						}
						//find the jQuery select obj with the ea_tab, data-strategy_value (indicator num, needs to be refactored), data-strategy_num
						//console.log( details );
					
					});
				}
			
			});
			
			//listen to Result Type radio (and show variables textarea if adjusted is selected on any)
			jQuery("input[name$='_result_type']").on("click", show_adjusted_variables );
			
			//initialize adjusted variables (to show if saved value is 'adjusted' for ResultType radio
			init_adjusted_variables();
			
			//stop time messages on results page
			stop_time_validate();
			
			
			//add direction and up to 5 strategies on each EA tab for EACH indicator
			ea_indicators_add_strategies_directions( jQuery('#ea_template_result_indicator') );
			
			//add click/select listeners to 'not reported' checkboxes and corresponding radios
			var not_reported_checkboxes = jQuery('form#study_form .not_reported_clear');
			var not_reported_radios = jQuery('form#study_form input[data-notreported_id]');
			
			//remove previous click handler (so no duplicate events)
			//not_reported_checkboxes.off("click", uncheck_not_reported_related_fields);
			//not_reported_radios.off("click", uncheck_not_reported_checkboxes);
			
			//add new clickhandler to all checkboxes/radios
			jQuery.each( not_reported_checkboxes, uncheck_not_reported_related_fields );
			jQuery.each( not_reported_radios, uncheck_not_reported_checkboxes );
		
			//other populations textarea listen
			jQuery('.other_populations_textenable').off("click", other_populations_textarea_enable);
			jQuery('.other_populations_textenable').on("click", other_populations_textarea_enable);
			
			check_measures_selected();
			
		}).always(function() {
			//regardless of outcome, hide spinny
			//jQuery('.action-steps').removeClass("hidden");
		});
	}
}

//refresh page with appropriate data in url (for now)
function load_selected_study(){

	//construct url
	var redirectTo = transtria_ajax.study_home + "?study_id=" + jQuery( "#studyid" ).val();
	
	//aaand, redirect
	window.location.replace( redirectTo );
}



//save study
function save_study(){
	
	//if hidden param 
	if( jQuery("#this_study_id").val().length > 0 ){
		this_study_id = jQuery("#this_study_id").val();
	} else {
		//what's the study id in the url?
		this_study_id = getURLParameter('study_id');
	}
	
	//user messages
	var spinny = jQuery('.basic_info_messages .spinny');
	var usrmsg = jQuery('.basic_info_messages .usr-msg');
	var usrmsgshell = jQuery('.basic_info_messages');
	
	//form metadata
	var num_ea_tabs = jQuery("#effect_association_tabs ul li").length;
	var last_tab = jQuery('.subpops_tab').last().attr('id').split('-')[0];
	var last_tab_num = last_tab.replace('ese', '');
	var num_ese_tabs = parseInt( last_tab_num );
	var num_other_ind = 0;
	//other indicators
	jQuery.each( jQuery('input.other_indicator'), function(){
		if ( jQuery(this).val() != "" ){
			num_other_ind++;
		}
	}); //.length;
	//other outcomes
	var num_other_out = 0;
	jQuery.each( jQuery('input.other_outcome'), function(){
		if ( jQuery(this).val() != "" ){
			num_other_out++;
		}
	}); //.length;
	
	
	//form data
	var studies_table_data = jQuery('.studies_table'); //data that goes into the study table in the db
	var studies_table_vals = {};
	var population_table_data = jQuery('.population_table'); //data that goes into the population table in the db
	var pops_table_vals = {};
	var ea_table_data = jQuery('.ea_table').not("[id^=ea_template]"); //ignore our ea template (hidden and from which we get/copy our ea tabs)
	var ea_table_vals = {};
	var ea_table_other_indicators = "";  //will be a serialized array of which other indicator ids are selected
	var ea_table_other_outcomes = "";  //will be a serialized array of which other indicator ids are selected
	var code_table_data = jQuery(".multiselect"); //multiselects all go to code results table
	var checked_holder = {};
	var checked_holder_vals = []; //holds multiselect vals while iterating
	var code_table_vals = {};
	var special_table_data = jQuery('.special_table'); //data that doesn't fit the existing paradigms.
	var special_vals = {};
	
	var index_name = "";
	
	jQuery.each( studies_table_data, function( index, element ){
	
		//if element is checkbox, index by name, else by id
		if( jQuery( element ).is('input:radio')){
			//we need to think about this.
			index_name = jQuery(this).attr("name");
			this_checks = jQuery('input[name="' + index_name + '"]:checked').val();
			//check for undefined values (overwriting existing checks as "")
			if( this_checks == undefined ){
				this_checks = "";
			}
			
			studies_table_vals[ index_name ] = this_checks;
			
		} else {
			index_name = jQuery(this).attr("id");
			studies_table_vals[ index_name ] = get_field_value( jQuery(this ) );
		}
		
	});
	
	//cycle through pops data and put in flat object
	jQuery.each( population_table_data, function( index, element ){
	
		//if element is checkbox, index by name, else by id
		if( jQuery( element ).is('input:radio')){
			//we need to think about this.
			index_name = jQuery(this).attr("name");
			this_checks = jQuery('input[name="' + index_name + '"]:checked').val();
			//check for undefined values (overwriting existing checks as "")
			if( this_checks == undefined ){
				this_checks = "";
			}
			
			pops_table_vals[ index_name ] = this_checks;
			
		} else {
			index_name = jQuery(this).attr("id");
			pops_table_vals[ index_name ] = get_field_value( jQuery(this ) );
		}
		
	});
	
	//cycle through ea data and put in flat object
	jQuery.each( ea_table_data, function( index, element ){
	
		//if element is checkbox, index by name, else by id
		if( jQuery( element ).is('input:radio')){
			//we need to think about this.
			index_name = jQuery(this).attr("name");
			ea_table_vals[ index_name ] = jQuery('input[name="' + index_name + '"]:checked').val();
			
		} else {
			index_name = jQuery(this).attr("id");
			ea_table_vals[ index_name ] = get_field_value( jQuery(this ) );
		}
		
	});
	
	var is_indicator_multi = false;
	var is_outcome_multi = false;
	var comma_delimited_ea_vals = "";
	var comma_delimited_outcome_ea_vals = "";
	
	jQuery.each( code_table_data, function( index, element ){
	
		checked_holder_vals = []; //clear our temp checked vals
		index_name = jQuery(this).attr("id");
		var which_index = jQuery(this);
		
		//exception 1 - other indicators should be saved in EA table, special case
		if( which_index.is('[id$="_result_indicator"]') ){
			is_indicator_multi = true;
			comma_delimited_ea_vals = ""; //reset string that will hold vals for ea
			//which ese tab are we on?
			var which_ea = which_index.parents('.one_ea_tab').attr('data-which_tab_num');
		}
		
		//exception 2 - other indicators should be saved in EA table, special case
		if( which_index.is('[id$="_result_outcome_accessed"]') ){
			is_outcome_multi = true;
			comma_delimited_outcome_ea_vals = ""; //reset string that will hold vals for ea
			//which ese tab are we on?
			var which_ea = which_index.parents('.one_ea_tab').attr('data-which_tab_num');
		}
		
		//multiselect returns object array of those checked
		checked_holder = which_index.multiselect("getChecked");
		
		//cycle through checked values and see which have been selected
		jQuery.each( checked_holder, function(  ){
		
			if( is_indicator_multi ) {
				//is this value an 'other indicator'?
				var found_index = jQuery(this).val().indexOf( 'other_intervention_indicators' );
				if( found_index != -1 ){ //we have a value starting with 'other_intervention_indicators' in checked vals
					//move this value to comma_delimited_ea_vals
					comma_delimited_ea_vals += "," + jQuery(this).val();
					//ea_table_vals[ 'other_indicators' ] = comma_delimited_ea_vals;
					
					//return true; //skip to next jQuery.each iteration
				} else {
					checked_holder_vals.push( jQuery(this).val() );
				}
			} else if ( is_outcome_multi ) {
				//is this value an 'other indicator'?
				var found_index = jQuery(this).val().indexOf( 'other_intervention_outcomes_assessed' );
				if( found_index != -1 ){ //we have a value starting with 'other_intervention_indicators' in checked vals
					//move this value to comma_delimited_ea_vals
					comma_delimited_outcome_ea_vals += "," + jQuery(this).val();
					//ea_table_vals[ 'other_indicators' ] = comma_delimited_ea_vals;
					
					//return true; //skip to next jQuery.each iteration
				} else {
					checked_holder_vals.push( jQuery(this).val() );
				}			
			} else {
				//not in indicator multi
				checked_holder_vals.push( jQuery(this).val() );
			}
			
		});
		
		code_table_vals[ index_name ] = checked_holder_vals;
		
		//append comma-delimted string to ea_table_vals
		if( is_indicator_multi ){
			//console.log( comma_delimited_ea_vals );
			ea_table_vals[ 'ea_' + which_ea + '_other_indicators' ] = comma_delimited_ea_vals;
		} else if( is_outcome_multi ){
			//console.log( comma_delimited_ea_vals );
			ea_table_vals[ 'ea_' + which_ea + '_other_outcomes' ] = comma_delimited_outcome_ea_vals;
		}
		
		//reset indicator multi flag
		is_indicator_multi = false;
		is_outcome_multi = false;
		
	});
	//console.log( code_table_vals);

	
	var result_strategy_obj = {};  //array ( option_num => { 1 => strategy num, 2=> strategy_num }, option_num...  );
	/*
		array(
			[ea_tab_num] => array(
				'indicators' => array(
					ind1 => array (
						'strategies' => array(
							1 => strategy_num,
							2 => strategy_num2
							...
							5 => strategy_num5
						),
						'direction' => int
					),
					ind2 => array(
						...
					),...
				)
			),
			[ea_tab_num_next] => ...
	
	*/
	var result_direction_obj = {};  //array ( option_num => { 1 => strategy num, 2=> strategy_num }, option_num...  );
	
	
	//instatiate objs for each ea tab
	for( var ea=1; ea <= num_ea_tabs; ea++ ){
		result_strategy_obj[ea] = {};
		result_strategy_obj[ea].indicators = {};
	}
	
	//cycle through and massage 'special' data as needed
	jQuery.each( special_table_data, function( index, element ){
	
		//these are either of class .result_strategy or .result_direction
		//console.log( jQuery(element ) );
		var this_ea_tab = 0;
		var this_ind_num = 0; //[data-strategy_value] //TODO: refactor!
		var this_strategy_num = 0;
		var this_strategy_value = 0;
		var this_direction_value = 0;
		
		if( ( num_ea_tabs > 0 ) && ( jQuery(element).hasClass('result_strategy') ) ){
			//console.log(  jQuery( element ).val()  );
			if( jQuery( element ).val() != "-1" ){ //if we've actually selected something
				//put in result_strategy_obj{}
				this_ea_tab = jQuery( element ).attr("data-this_ea_tab");
				this_ind_num = jQuery( element ).attr("data-strategy_value");
				this_strategy_num = jQuery( element ).attr("data-strategy_num");
				this_strategy_value = jQuery( element ).val();
				
				//test to see if we have this indicator number yet defined in this result_strategy_object level; if not, define
				if( result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ] == undefined ){
					result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ] = {};
				}
				
				//test to see if we have 'strategies' defined in this result_strategy_object level; if not, define
				if( result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['strategies'] == undefined ){
					result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['strategies'] = {};
				}
				
				//add on to result_strategy_obj
				result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['strategies'][this_strategy_num] = this_strategy_value;

			}
		
		} else if( ( num_ea_tabs > 0 ) && ( jQuery(element).hasClass('result_direction') ) ){
			
			if( jQuery( element ).val() != "-1" ){ //if we've actually selected something
				//put in result_strategy_obj{}
				this_ea_tab = jQuery( element ).attr("data-this_ea_tab");
				this_ind_num = jQuery( element ).attr("data-strategy_value");
				this_direction_value = jQuery( element ).val();
				
				//test to see if we have this indicator number yet defined in this result_strategy_object level; if not, define
				if( result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ] == undefined ){
					result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ] = {};
				}
				
				//test to see if we have 'direction' defined in this result_strategy_object level; if not, define
				if( result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['direction'] == undefined ){
					result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['direction'] = {};
				}
				
				result_strategy_obj[ this_ea_tab ]['indicators'][ this_ind_num ]['direction'] = this_direction_value;
		
			}
		
		}
		
		//append result_strategy_obj result to ea_table_vals[ 'indicator_strategies ]
		
		//append result_direction_obj result to ea_table_vals[ 'indicator_directions ]
	
	});
	
	special_vals = result_strategy_obj;
	//console.log( result_strategy_obj );
	
	//ajax data
	var ajax_action = 'save_study_data';
	var ajax_data = {
		'action': ajax_action,
		'this_study_id' : this_study_id,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'num_ea_tabs' : num_ea_tabs,
		'num_ese_tabs' : num_ese_tabs,
		'num_other_ind' : num_other_ind,
		'num_other_out' : num_other_out,
		'studies_table_vals' : studies_table_vals,
		'population_table_vals' : pops_table_vals,
		'ea_table_vals' : ea_table_vals,
		'code_table_vals' : code_table_vals,
		'special_vals' : special_vals
	};
	
	//Save study data
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			//scroll to top
			jQuery("html, body").animate({ scrollTop: 0 }, "slow");
			//show user message and spinny
			usrmsg.html("Saving Study, hang tight..." );
			usrmsgshell.fadeIn();
			spinny.fadeIn();
			
		}
	}).success( function( data ) {
		
		//var post_meat = JSON.parse( data );
		//console.log('success: ' + data['pops_success']);
		
		usrmsg.html("Saving Study, ID: " + data['study_id'] );
		
		//TODO: send message if empty (directing user to add priority page?)
		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
			
		}
		//var post_meat = data['single']; // = JSON.parse(data);
	}).complete( function( data ) {
		spinny.hide();
		//console.log( data );
		//console.log( data );
			//error messages!
		var error_message = "";
		if( data.responseJSON.studies_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message = data.responseJSON.studies_success.toString() + "\r\n";
		}
		//metadata table
		if( data.responseJSON.meta_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message += data.responseJSON.meta_success.toString() + "\r\n";
		}
		//ea table
		if( data.responseJSON.ea_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message += data.responseJSON.ea_success.toString() + "\r\n";
		}
		//code results table (multiple selects)
		if( data.responseJSON.code_results_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message += data.responseJSON.code_results_success.toString() + "\r\n";
		}
		//special things table (EA tab Strategies/Directions)
		if( data.responseJSON.special_results_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message += data.responseJSON.special_results_success.toString() + "\r\n";
		}
		//Populations table errors: TODO - this!
		if( data.responseJSON.pops_success.toString().substr(0,5).toLowerCase() == "error" ){
			error_message += data.responseJSON.pops_success.toString() + "\r\n";
		}
		
		//display error message
		//usrmsg.html("Saving Study, ID: " + data['study_id'] );
		
		//if we get back a valid study_id and NO error message
		if( ( data.responseJSON["study_id"] > 0 ) && ( data.responseJSON["study_id"] != null ) && ( data.responseJSON["study_id"] != undefined )
			&& ( error_message.length <= 0 ) ){
			usrmsg.html("Study ID " + data.responseJSON["study_id"] + " saved successfully!" );
			usrmsgshell.fadeOut( 6000 );
			
			//make sure our returned study id is saved to hidden param
			jQuery("#this_study_id").val( data.responseJSON["study_id"] );
			
			//add study value to select#studyid and mark as checked
			jQuery("select#studyid").append("<option value='" + data.responseJSON["study_id"] + "'>" + data.responseJSON["study_id"] + "</option>")
			jQuery("select#studyid").val( data.responseJSON["study_id"] );
			
		} else { 
			//usrmsg.html("Problem occured while saving. <br /> Report: " + data.responseJSON );
			usrmsg.html("Problem occured while saving. If you need help, please contact CARES with the following - <br /> Report: " + error_message );
			jQuery("#this_study_id").val("");
		}
		
	
	});;

	
	
}

//gets the field value given a jQuery selector
//does not handle checkboxes right now!
function get_field_value( incoming ){

	var current_val;
	//what is our selector type?
	if( incoming.is('select') ){
		//see if there's a matching option
		var children = incoming.children('option');
		//iterate through option values
		jQuery.each( children, function(){
			if( jQuery(this).prop("selected") == true){
				//what is current option value
				current_val = jQuery(this).val();
				current_val = current_val.trim(); //if whitespace because sometimes there is..*sigh*
			}
		});
	} else if ( incoming.is('input:text') || incoming.is('textarea') ){
		//easy-peasy
		current_val = incoming.val( );
	
	} else if ( incoming.is('input:checkbox') ){
		if( incoming.is(":checked") ){
			current_val = "Y";
		} else {
			current_val = "N";
		}
	} 
	
	return current_val;
	//console.log( incoming );

}

//listen to ability status multiselect and show/hide corresponding percentage inputs

/***** form field functionality ****/

//show 'variables' textarea if corresponding result_type 'Adjusted' radio is selected
function show_adjusted_variables(){

	//get the parent?
	var input_wrapper = jQuery( this ).parent();
	
	//disable _result_type
	//var checked_results_types = jQuery("input[name$='_result_type']:checked");
	var checked_results_types = input_wrapper.find("input:checked");
	
	//if we have checked result types
	if( checked_results_types.length > 0 ) {
		jQuery.each( checked_results_types, function(){
			//if 'adjusted' is chosen, show variables box
			if( jQuery( this ).val() == "A" ){
				jQuery( this ).parents('.one_ea_tab').find('[id$="_results_variables_tr"]').removeClass("noshow");
			} else {
				//hide variables box
				jQuery( this ).parents('.one_ea_tab').find('[id$="_results_variables_tr"]').addClass("noshow");
			}
		
		});
	}
}

function init_adjusted_variables(){

	//get the parent?
	var input_wrapper = jQuery("input[name$='_result_type']").parent();
	
	jQuery.each( input_wrapper, function(){ 
		//var checked_results_types = jQuery("input[name$='_result_type']:checked");
		var checked_results_types = input_wrapper.find("input:checked");
		
		//if we have checked result types
		if( checked_results_types.length > 0 ) {
			jQuery.each( checked_results_types, function(){
				//if 'adjusted' is chosen, show variables box
				if( jQuery( this ).val() == "A" ){
					jQuery( this ).parents('.one_ea_tab').find('[id$="_results_variables_tr"]').removeClass("noshow");
				} else {
					//hide variables box
					jQuery( this ).parents('.one_ea_tab').find('[id$="_results_variables_tr"]').addClass("noshow");
				}
			
			});
		}
	});


}

function ability_status_limiter( all_pops ){


	//console.log( jQuery(this).val() );
	var which_selected = jQuery(this).val();
	var which_pop = jQuery(this).parents(".subpops_content").children("input.population_type").val();
	
	//hide all ability percents in this pop type
	jQuery( "tr." + which_pop + "-ability-percent").hide();
	
	//show only those ability percents chosen
	if( which_selected != null ){
		jQuery.each( which_selected, function() {
		
			var this_selection = parseInt(this);
			jQuery( "tr." + which_pop + "-ability-percent[data-ability-value='" + this_selection + "']" ).show();
		
		});
	}

}

function ability_status_initialize(){

	//on page laod, trigger ability status listener on all pop drop downs
	var initial_ability_dropdowns = jQuery( "[id$='_ability_status']" );
	jQuery.each( initial_ability_dropdowns, function() {
		jQuery( this ).on("click", ability_status_limiter );
		jQuery( this ).trigger("click" );
	});
	
}

//display message on Results page if stop time isn't entered
function stop_time_validate( thisid, thisvalue ){
	//console.log("stop time validate functiooon");
	//really convoluted way of detecting SELECTED event with combobox...change not working, grr
	thisid = thisid || '';
	thisvalue = thisvalue || '';

	//if abstractor selected and no stop time selected, give message 
	var abstractorVal = jQuery("#abstractor").val();
	var validatorVal = jQuery("#validator").val();

	if( ( ( validatorVal != '' ) && ( validatorVal != 'None' ) && ( thisid == '' ) ) ||
		( ( thisid == "validator" ) && ( thisvalue != "00" ) ) ) {
		if ( ( jQuery('#validatorstoptime').val() == '' ) || ( parseInt( jQuery('#validatorstoptime').val()  ) == 0 ) ){
			jQuery('.validator-stop-time-reminder').show();
		} else {
			jQuery('.validator-stop-time-reminder').hide();
		}
	} else if( ( ( ( validatorVal == '' ) || ( validatorVal == 'None' ) ) && ( thisid == '' ) ) || 
		( ( thisid == "validator" ) && ( thisvalue == "00" ) ) ) {
		jQuery('.validator-stop-time-reminder').hide();
	}

	if( ( ( abstractorVal != '' ) && ( abstractorVal != 'None' ) && ( thisid == '' ) ) ||
		( ( thisid == "abstractor" ) && ( thisvalue != "00" ) ) ) { 
		if ( ( jQuery('#abstractorstoptime').val() == '' ) || ( parseInt( jQuery('#abstractorstoptime').val() ) == 0 ) ){
			jQuery('.abstractor-stop-time-reminder').show(); 
		} else {
			jQuery('.abstractor-stop-time-reminder').hide();
		}
	} else if( ( ( ( abstractorVal == '' ) || ( abstractorVal == 'None' ) ) && ( thisid == '' ) ) ||
		( ( thisid == "abstractor" ) && ( thisvalue == "00" ) ) ) {
			jQuery('.abstractor-stop-time-reminder').hide();
	}
}

//change ea direction based on
function ea_direction_calc(){

	var which_tab = jQuery(this).parents('.one_ea_tab').attr("data-which_tab_num");
	
	var ind = jQuery('#ea_' + which_tab + '_result_indicator_direction').val();
	var out = jQuery('#ea_' + which_tab + '_result_outcome_direction').val();
	
	var this_direction = jQuery('#ea_' + which_tab + '_result_effect_association_direction');
	
	//if either indicator or outcome direction isn't selected, we have no EA direction
	if ( ind == undefined || out == undefined || ind == "" || out == "") {
		this_direction.val('');
		return;
	}
	
	//if both ind and out have values, algorithmize for ea direction!
	switch(ind) {
		case '01':
		case '04':
			if (out == '01' || out == '04') {
				this_direction.val('Positive(+)')
			} else if (out == '02' || out == '03') {
				this_direction.val('Negative(-)')
			} else {
				this_direction.val('')
			}
			return;
		case '02':
		case '03':
			if (out == '02' || out == '03') {
				this_direction.val('Positive(+)')
			} else if (out == '01' || out == '04') {
				this_direction.val('Negative(-)')
			} else {
				this_direction.val('')
			}
			return;
	} // switch

}

//show/hide confounders text area on confounders YES/NO
function confounder_type_show(){
	if( jQuery("[name='confounders']:checked").val() == "Y" ){
		jQuery("tr#confounders_type").show();
	} else {
		jQuery("tr#confounders_type").hide();
	}
}

//show/hide HR subpopulations on IPE tabs based on applicability to HR sub pops question
function ipe_hr_subpops_show(){
	//if the IPE HR radio is 'Y', show the HR Subpopulations dropdown, else don't.
	if( jQuery("[name='ipe_applicability_hr_pops']:checked").val() == "Y" ){
		jQuery("tr.ipe_hr_subpopulations").show();
	} else {
		jQuery("tr.ipe_hr_subpopulations").hide();
	}
	
	//BUT, if the 'ipe_applicabilityhrpops_notreported' checkbox is checked, hide the HR subpopulations
	if( jQuery("#ipe_applicabilityhrpops_notreported").is(":checked") ){
		jQuery("tr.ipe_hr_subpopulations").hide();
	}
} 

//show/hide HR subpopulations on ESE tab based on 'Oversampling' radio OR 'Oversampling not reported' checkbox (ESE only)
function ese_hr_subpops_show(){
	var index_of_under = jQuery(this).attr("name").indexOf("_");
	
	if( index_of_under != -1 ){
		//which ese?
		var starts_with = jQuery(this).attr("name").substr( 0, index_of_under );
		if( jQuery("[name='" + starts_with + "_oversampling']:checked").val() == "Y" ){
			jQuery("tr." + starts_with + "_hr_subpopulations").show();
		} else {
			jQuery("tr." + starts_with + "_hr_subpopulations").hide();
		}
	}
}

//Limit strategy selects on EA/Results based on intervention selection
function strategy_limit_results( ){

	var selected = jQuery("#strategies").multiselect("getChecked");
	//get values and titles
	var selection = {};
	var selections = [];  //array to hold selection objects

	jQuery.each( selected.filter(":input"), function(){
	selection = { 
	   _value : this.value,
	   _title : this.title
	}    
	selections.push(selection);

	});
	//update the results strategies dropdowns
	//var resultsDropdowns = jQuery("[id$=_result_strategy]");
	var resultsDropdowns = jQuery(".result_strategy");

	jQuery.each( resultsDropdowns, function() {
		var result = jQuery(this); 
		//remove ALL options
		jQuery(this).find("option").remove();

		//ad a -- Select Option -- option
		result.append(
		  jQuery('<option></option>').val( "-1").html("---Select---")
	   );
		   
		//iterate for each value
		jQuery.each(selections, function(){
		   //result.find("option[value=" + this + "]").remove();   
		   //add options
		   result.append(
			  jQuery('<option></option>').val(this._value).html(this._title)
		   );
		});
	});

}
	

//when 'add ese' is clicked, copy original ESE tab - false, this has changed 15Sept2015 (create, don't copy!
function copy_ese_tab(){

	var new_tab_id = 0;
	var last_tab = jQuery('.subpops_tab').last().attr('id');
	var last_tab_arr = last_tab.split('-');
	var lastChar = last_tab_arr[0].substr(last_tab_arr[0].length - 1);
	if (!isNaN(lastChar)) 
	{
		new_tab_id = Number(lastChar) + 1;
	}
	
	if( new_tab_id > 9 ){
		console.log('max tabs reached!');
		return;
	}
	
	//add a new tab to the pops section
	jQuery('#sub_pops_tabs').append("<div id='ese" + new_tab_id + "-tab' class='subpops_tab'><label class='subpops_tab_label' for='ese" + new_tab_id + "-tab' data-whichpop='ese" + new_tab_id + "'>ese" + new_tab_id + "</label></div>");
	
	//destroy the multiselects before we clone
	try {
		jQuery('.ese_copy_multiselect').multiselect("destroy");
	} catch( err ) {
		console.log( "could not destroy ese_copy_multiselect");
	}
	
	//we will need to copy the main ese tab
	var new_ese_copy = jQuery('.ese_content').clone(true,true);
	var save_study_button_html = jQuery('.button.save_study');
	
	//copy textareas (clone does not do this: http://api.jquery.com/clone/)
	new_ese_copy.find("#ese_other_population_description").val( jQuery(".ese_content #ese_other_population_description").val() );
	
	//copy select selections (clone does not do this)
	var selections_object = {};
	
	//create object with old options and new select object (for fun and easy iteration)
	selections_object[ 'selected_geo_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_geographic_scale"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_geographic_scale"]')
	}
	selections_object[ 'selected_hr_pops_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_hr_subpopulations"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_hr_subpopulations"]')
	}
	selections_object[ 'selected_ability_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_ability_status"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_ability_status"]')
	}
	selections_object[ 'selected_subpops_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_sub_populations"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_sub_populations"]')
	}
	selections_object[ 'selected_youthpops_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_youth_populations"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_youth_populations"]')
	}
	selections_object[ 'selected_profpops_options' ] = {
		_options : jQuery('.ese_content').find('[id$="_professional_populations"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_professional_populations"]')
	}
	selections_object[ 'selected_gender_option' ] = {
		_options : jQuery('.ese_content').find('[id$="_gender"] option:selected'),
		_new_select : new_ese_copy.find('[id$="_gender"]') //there should be just one
	}
	
	//mark 'selected' options as selected in new_ese_copy 
	jQuery.each( selections_object, function( index, value ){
	
		var org_options = this._options;
		var new_select = this._new_select;
		
		//if we have selected options in original tab
		if( org_options.length > 0 ){
		
			jQuery.each( org_options, function(){
				current_option_val = jQuery(this).val();
				//.find('option[value="01"]')
				new_option = new_select.find('option[value="' + current_option_val + '"]');
				if( new_option.length > 0 ) { //if new option exists
					new_option.attr("selected","selected");
				
				}
			});
		}
	});
	
	//var inits
	var new_pop_type = "";
	var old_id = "";
	var new_id = "";
	var old_name = "";
	var new_name = "";
	
	//what prepend do we need?  get current population type
	new_pop_type = "ese" + new_tab_id;
	
	//change current pop type
	new_ese_copy.find(".population_type").val( new_pop_type );
	
	//change subtitle
	new_ese_copy.find("td.inner_table_header").html("<strong>Evaluation Sample - EXPOSED: " + new_tab_id + "</strong>");
	
	//change subtab class
	new_ese_copy.removeClass("ese_content");
	new_ese_copy.addClass( new_pop_type + "_content");
	
	//change all the div ids that begin w ese
	var all_ese_ids = new_ese_copy.find("[id^=ese]");
	var all_ese_names = new_ese_copy.find("[name^=ese]");
	//var all_ese_multis = new_ese_copy.find(".multiselect");
	
	//go through each div in the clone and update the id
	jQuery.each( all_ese_ids, function() {
		//get old id
		old_id = jQuery(this).attr("id");
		//get first 3 digits (hint: it'll be 'ese' every time.  Why are we substringing, Mel?)
		old_id = old_id.substring(3); 
		
		//get ourselves a new id!
		new_id = new_pop_type + old_id;
		
		jQuery(this).attr("id", new_id);
	});
	
	//go through each name in the clone and update the name
	jQuery.each( all_ese_names, function() {
		//get old id
		old_name = jQuery(this).attr("name");
		//get first 3 digits (hint: it'll be 'ese' every time.  Why are we substringing, Mel?)
		old_name = old_name.substring(3); 
		
		//get ourselves a new id!
		new_name = new_pop_type + old_name;
		
		jQuery(this).attr("name", new_name);
	});
	
	//other populations textarea listen
	new_ese_copy.find('.other_populations_textenable').off("click", other_populations_textarea_enable);
	new_ese_copy.find('.other_populations_textenable').on("click", other_populations_textarea_enable);
	
		
	//append to population div id="populations_Tabs
	new_ese_copy.appendTo( jQuery("#population_tabs") );
	
	//remove old 'save study' button and re-place
	//save_study_button_html.remove();
	//save_study_button_html.appendTo( jQuery("#population_tabs") );
	
	//reattach click listeners to pops tabs
	var which_content = new_pop_type + '_content';
	
	jQuery('#sub_pops_tabs label.subpops_tab_label[data-whichpop="' + new_pop_type + '"]').on("click", function() {
	
		//hide all subpops content
		jQuery('.subpops_content').hide();
		
		//add selected active class after removing it from all
		jQuery('label.subpops_tab_label').removeClass('active');
		jQuery(this).addClass('active');

		jQuery('.subpops_content.' + which_content).show();
		
	});
	
	
	//recreate ese multiselects
	jQuery(".ese_copy_multiselect").multiselect({
		header: true,
		position: {my: 'left bottom', at: 'left top'},
		selectedText: '# of # checked',
		//selectedList: 4, 
		close: function( event, ui ){
			//multiselect_listener( jQuery(this) );
		}
	}); 

}

function create_ese_tab(){

	var new_tab_id = 0;
	var last_tab = jQuery('.subpops_tab').last().attr('id');
	var last_tab_arr = last_tab.split('-');
	var lastChar = last_tab_arr[0].substr(last_tab_arr[0].length - 1);
	if (!isNaN(lastChar)) 
	{
		new_tab_id = Number(lastChar) + 1;
	}
	
	if( new_tab_id > 9 ){
		console.log('max tabs reached!');
		return;
	}
	
	//add a new tab to the pops section
	jQuery('#sub_pops_tabs').append("<div id='ese" + new_tab_id + "-tab' class='subpops_tab'><label class='subpops_tab_label' for='ese" + new_tab_id + "-tab' data-whichpop='ese" + new_tab_id + "'>ese" + new_tab_id + "</label></div>");
	
	//destroy the multiselects before we clone
	try {
		jQuery('.ese_copy_multiselect').multiselect("destroy");
	} catch( err ) {
		console.log( "could not destroy ese_copy_multiselect");
	}
	
	//we will need to copy the main ese tab
	var new_ese_copy = jQuery('.ese_content').clone(true,true);
	
	//clear all inputs for that tab
	new_ese_copy.find('input').val("");
	new_ese_copy.find('input:radio').prop('checked', false);
	new_ese_copy.find('input:checkbox').prop('checked', false);
	
	var save_study_button_html = jQuery('#population_tabs .button.save_study');
	
	
	
	//var inits
	var new_pop_type = "";
	var old_id = "";
	var new_id = "";
	var old_name = "";
	var new_name = "";
	
	//what prepend do we need?  get current population type
	new_pop_type = "ese" + new_tab_id;
	
	//change current pop type
	new_ese_copy.find(".population_type").val( new_pop_type );
	
	//change subtitle
	new_ese_copy.find("td.inner_table_header").html("<strong>Evaluation Sample - EXPOSED: " + new_tab_id + "</strong>");
	
	//change subtab class
	new_ese_copy.removeClass("ese_content");
	new_ese_copy.addClass( new_pop_type + "_content");
	
	//change all the div ids that begin w ese
	var all_ese_ids = new_ese_copy.find("[id^=ese]");
	var all_ese_names = new_ese_copy.find("[name^=ese]");
	//var all_ese_multis = new_ese_copy.find(".multiselect");
	
	//go through each div in the clone and update the id
	jQuery.each( all_ese_ids, function() {
		//get old id
		old_id = jQuery(this).attr("id");
		//get first 3 digits (hint: it'll be 'ese' every time.  Why are we substringing, Mel?)
		old_id = old_id.substring(3); 
		
		//get ourselves a new id!
		new_id = new_pop_type + old_id;
		
		jQuery(this).attr("id", new_id);
	});
	
	//go through each name in the clone and update the name
	jQuery.each( all_ese_names, function() {
		//get old id
		old_name = jQuery(this).attr("name");
		//get first 3 digits (hint: it'll be 'ese' every time.  Why are we substringing, Mel?)
		old_name = old_name.substring(3); 
		
		//get ourselves a new id!
		new_name = new_pop_type + old_name;
		
		jQuery(this).attr("name", new_name);
	});
	
	//other populations textarea listen
	new_ese_copy.find('.other_populations_textenable').off("click", other_populations_textarea_enable);
	new_ese_copy.find('.other_populations_textenable').on("click", other_populations_textarea_enable);
	
	//show remove tab button for this tab
	var remove_button = new_ese_copy.find(".remove_ese_tab");
	remove_button.removeClass("noshow");
	
	
	//append to population div id="populations_Tabs
	new_ese_copy.appendTo( jQuery("#population_tabs") );
	//new_ese_copy.insertBefore( save_study_button_html );
	
	//remove old 'save study' button and re-place
	save_study_button_html.remove();
	save_study_button_html.appendTo( jQuery("#population_tabs") );
	
	//reattach click listeners to pops tabs
	var which_content = new_pop_type + '_content';
	
	jQuery('#sub_pops_tabs label.subpops_tab_label[data-whichpop="' + new_pop_type + '"]').on("click", function() {
	
		//hide all subpops content
		jQuery('.subpops_content').hide();
		
		//add selected active class after removing it from all
		jQuery('label.subpops_tab_label').removeClass('active');
		jQuery(this).addClass('active');

		jQuery('.subpops_content.' + which_content).show();
		
	});
	
	
	//recreate ese multiselects
	jQuery(".ese_copy_multiselect").multiselect({
		header: true,
		position: {my: 'left bottom', at: 'left top'},
		selectedText: '# of # checked',
		//selectedList: 4, 
		close: function( event, ui ){
			//multiselect_listener( jQuery(this) );
		}
	}); 

}

//when clicking 'delete ese tab', this is what happens
function remove_ese_tab(){
	//which tab are we removing?
	var tab_div = jQuery(this).parents('.subpops_content');
	var which_tab = tab_div.find('input.population_type').val();
	
	//console.log( which_tab);
	
	//remove the tab and the header tab
	jQuery('.subpops_content.' + which_tab + '_content').remove();
	jQuery('#' + which_tab + '-tab').remove();
	
	//hmm, pick a tab to show instead of this non-tab - trigger click
	jQuery('#sub_pops_tabs label.subpops_tab_label[data-whichpop="tp"]').trigger("click");	
	
	//renumber all the ese tabs, oh joy
	renumber_ese_tabs();

}

//renumber ese tabs; useful when middle tabs are deleted
function renumber_ese_tabs(){

	//determine if any ese tabs are NOT in a sequence
	//get highest ese tab number:
	var last_tab = jQuery('.subpops_tab').last().attr('id');
	var last_tab_arr = last_tab.split('-');
	var lastChar = last_tab_arr[0].substr(last_tab_arr[0].length - 1); //this is it
	
	if ( !isNaN(lastChar) ) {
		var last_tab_num = parseInt( lastChar );
	} else { //we don't have any ese tabs (since they are last and will always end in a number)
		return; //get out.  just GET OUT.
	}
	
	var ese_gaps = []; //to hold ese number gaps
	var actual_ese_tabs = [];
	
	//first run - do we have gaps?
	for( var i = 0; i <= last_tab_num; i++ ){
		//where are there gaps in our subpops_content?
		if( jQuery('#population_tabs .subpops_content.ese' + i + '_content').length <=0 ){
			ese_gaps.push( i );
		} else {
			actual_ese_tabs.push( i );
		}
	}
	
	//how to renumber, knowing the gaps?
	console.log( ese_gaps );
	console.log( actual_ese_tabs );
	
	//while loop to re-assess and close all the gaps
	while( ese_gaps.length > 0 ){
		
		//find which actual ese_tab is next highest from ese_gaps[0]
		var which_to_move_down;
		var this_ese_gap = ese_gaps[0];
		
		//get the next highest actual_ese_tab
		jQuery.each( actual_ese_tabs, function( index, value ) {
			console.log( value );
			if( value > this_ese_gap ){
				which_to_move_down = this;
				return false; //break each loop
			}
		});
		
		//reindex the first gap in the ese_gap array		
		if( !( isNaN( which_to_move_down ) ) ){
			reindex_ese_tab( '.ese' + which_to_move_down + '_content', this_ese_gap, which_to_move_down );
		}
		
		//reset our last tab number, etc
		last_tab = jQuery('.subpops_tab').last().attr('id');
		last_tab_arr = last_tab.split('-');
		lastChar = last_tab_arr[0].substr(last_tab_arr[0].length - 1); //this is it
	
		if ( !isNaN(lastChar) ) {
			last_tab_num = parseInt( lastChar );
		} else { //we don't have any ese tabs (since they are last and will always end in a number)
			return; //get out.  just GET OUT.
		}
	
		//clear existing ese_gaps and actual_tabs arrays
		ese_gaps = [];
		actual_ese_tabs = [];
		
		//re-assess the gaps and actual tabs
		for( var i = 0; i <= last_tab_num; i++ ){
			//where are there gaps in our subpops_content?
			if( jQuery('#population_tabs .subpops_content.ese' + i + '_content').length <=0 ){
				ese_gaps.push( i );
			} else {
				actual_ese_tabs.push( i );
			}
		}
		
	}

}


//function to re-index an ese tab, given a tab div and a number
//	which_div is flat (not a jQuery object)
function reindex_ese_tab( which_div, new_index, old_index ){

	//old div into object (for id-changing goodness)
	which_div_obj = jQuery( which_div );
	
	//destroy the multiselects before we change things
	try {
		jQuery( which_div + ' .ese_copy_multiselect').multiselect("destroy");
	} catch( err ) {
		console.log( "could not destroy ese_copy_multiselect");
	}
	
	//what prepend do we need?  get current population type
	new_pop_type = "ese" + new_index;
	
	//change subpops tab label, etc 
	var old_ese_tab = jQuery('#sub_pops_tabs').find('#ese' + old_index + '-tab');
	old_ese_tab.find('label').attr('data-whichpop', new_pop_type);
	old_ese_tab.find('label').attr('for', new_pop_type);
	old_ese_tab.find('label').html( new_pop_type );
	old_ese_tab.attr("id", new_pop_type + '-tab');
	
	//change current pop type
	which_div_obj.find(".population_type").val( new_pop_type );
	
	//change subtitle
	which_div_obj.find("td.inner_table_header").html("<strong>Evaluation Sample - EXPOSED: " + new_index + "</strong>");
	
	//change subpops content class
	which_div_obj.removeClass("ese" + old_index + "_content");
	which_div_obj.addClass( new_pop_type + "_content");
	
	//change all the div ids that begin w ese
	var all_ese_ids = which_div_obj.find("[id^=ese]");
	var all_ese_names = which_div_obj.find("[name^=ese]");
	
	//go through each div in the clone and update the id
	jQuery.each( all_ese_ids, function() {
		//get old id
		old_id = jQuery(this).attr("id");
		//get first 4 digits (hint: it'll be 'ese#' every time)
		old_id = old_id.substring(4); 
		
		//get ourselves a new id!
		new_id = new_pop_type + old_id;
		
		jQuery(this).attr("id", new_id);
	});
	
	//go through each name in the clone and update the name
	jQuery.each( all_ese_names, function() {
		//get old id
		old_name = jQuery(this).attr("name");
		//get first 3 digits (hint: it'll be 'ese#' every time)
		old_name = old_name.substring(4); 
		
		//get ourselves a new name and replace!
		new_name = new_pop_type + old_name;
		jQuery(this).attr("name", new_name);
	});
	
	//recreate ese multiselects in new tab
	jQuery( which_div + " .ese_copy_multiselect").multiselect({
		header: true,
		position: {my: 'left bottom', at: 'left top'},
		selectedText: '# of # checked',
		//selectedList: 4, 
		close: function( event, ui ){
			//multiselect_listener( jQuery(this) );
		}
	}); 

	//enable listeners
	//other populations textarea listen ?
	which_div_obj.find('.other_populations_textenable').off("click", other_populations_textarea_enable);
	which_div_obj.find('.other_populations_textenable').on("click", other_populations_textarea_enable);
	
	//reattach click listeners to pops tabs
	var which_content = new_pop_type + '_content';
	
	jQuery('#sub_pops_tabs label.subpops_tab_label[data-whichpop="' + new_pop_type + '"]').on("click", function() {
		//hide all subpops content
		jQuery('.subpops_content').hide();
		
		//add selected active class after removing it from all
		jQuery('label.subpops_tab_label').removeClass('active');
		jQuery(this).addClass('active');

		jQuery('.subpops_content.' + which_content).show();
		
	});
	
}


//when 'add ese' is clicked, copy whichever ea tab is selected
function copy_ea_tab(){

	//remove click listener from copy tab while we're here
	jQuery('.ea_copy_tab_button').off("click", copy_ea_tab );

	var whichtab_to_copy = jQuery(this).siblings('select').val();
	var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
	var new_tab_num = num_current_tabs + 1;
	
	//add a new tab to the ea tabs section
	jQuery('#effect_association_tabs ul').append("<li id='ea-tab-" + new_tab_num + "' class='ea_tab'><label class='ea_tab_label' for='ea-tab-" + new_tab_num + "' data-whichea='" + new_tab_num + "'>EA TAB " + new_tab_num + "</label></li>");
	
	//destroy the multiselects before we clone
	jQuery('.ea_multiselect').multiselect("destroy");
	
	//we will need to copy whichever tab is selected
	var tab_copied = jQuery('#effect_association_tab_' + whichtab_to_copy );
	var new_ea_copy = tab_copied.clone(true,true);
	
	//vars
	//what prepend do we need? 
	var new_prepend = "ea_" + new_tab_num;
	//what prepend are we getting rid of?
	var old_prepend = "ea_" + whichtab_to_copy;
	var old_id = "ea_" + whichtab_to_copy;
	var new_id = "";
	var old_name = "";
	var new_name = "";
	
	//change subtitle
	//new_ese_copy.find("td.inner_table_header").html("<strong>Evaluation Sample - EXPOSED: " + new_tab_num + "</strong>");
		
	//change all the div ids that begin w/ ea_old#
	var all_old_ea_ids = new_ea_copy.find("[id^='" + old_prepend + "']");
	var all_old_ea_names = new_ea_copy.find("[name^='" + old_prepend + "']");
	
	//update overall div#
	new_id = 'effect_association_tab_' + new_tab_num;
	new_ea_copy.attr("id", new_id);
	new_ea_copy.attr("data-which_tab_num", new_tab_num);
	//overall_div_id.attr("id", new_id);
	
	
	//go through each div in the clone and update the id
	jQuery.each( all_old_ea_ids, function() {
		//get old id
		old_id = jQuery(this).attr("id");
		
		//replace old prepend w new, save to new_id
		new_id = old_id.replace(old_prepend, new_prepend);  
		
		//replace div id
		jQuery(this).attr("id", new_id);
	});
	
	//go through each name in the clone and update the name
	jQuery.each( all_old_ea_names, function() {
		//get old id
		old_name = jQuery(this).attr("name");
		
		//replace old prepend w new, save to new_id
		new_name = old_name.replace(old_prepend, new_prepend);  
		
		//update the name?
		jQuery(this).attr("name", new_name);
	});
	
	//copy textareas (clone does not do this: http://api.jquery.com/clone/)
	new_ea_copy.find('[id$="_results_variables"]').val( tab_copied.find('[id$="_results_variables"]').val() );
	
	//go through each dropdown in the old and copy to new(jQuery clone() does not do this!)
	//copy select selections (clone does not do this)
	var selections_object = {};
	
	//create object with old, selected options and new select object (for fun and easy iteration)
	selections_object[ 'selected_duration' ] = {
		_options : tab_copied.find('[id$="_duration"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_duration"]')
	}
	selections_object[ 'selected_stat_model' ] = {
		_options : tab_copied.find('[id$="_result_statistical_model"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_statistical_model"]')
	}
	selections_object[ 'selected_result_eval_pop' ] = {
		_options : tab_copied.find('[id$="_result_evaluation_population"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_evaluation_population"]')
	}
	selections_object[ 'selected_result_subpops' ] = {
		_options : tab_copied.find('[id$="_result_subpopulations"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_subpopulations"]')
	}
	selections_object[ 'selected_ind_direction' ] = {
		_options : tab_copied.find('[id$="_result_indicator_direction"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_indicator_direction"]')
	}
	selections_object[ 'selected_out_direction' ] = {
		_options : tab_copied.find('[id$="_result_outcome_direction"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_outcome_direction"]')
	}
	selections_object[ 'selected_result_strategy' ] = {
		_options : tab_copied.find('[id$="_result_strategy"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_strategy"]')
	}
	selections_object[ 'selected_outcome_type' ] = {
		_options : tab_copied.find('[id$="_result_outcome_type"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_outcome_type"]')
	}
	selections_object[ 'selected_outcome_assessed' ] = {
		_options : tab_copied.find('[id$="_result_outcome_accessed"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_outcome_accessed"]') //yes, this is a legacy typo.  Nope, we can't change it now. DONT DO IT PLZ.
	}
	selections_object[ 'selected_measures' ] = {
		_options : tab_copied.find('[id$="_result_measures"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_measures"]')
	}
	selections_object[ 'selected_indicators' ] = {
		_options : tab_copied.find('[id$="_result_indicator"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_indicator"]')
	}
	selections_object[ 'selected_stat_measure' ] = {
		_options : tab_copied.find('[id$="_result_statistical_measure"] option:selected'),
		_new_select : new_ea_copy.find('[id$="_result_statistical_measure"]') 
	}
	
	//mark 'selected' options as selected in new_ea_copy 
	jQuery.each( selections_object, function( index, value ){
	
		var org_options = this._options;
		var new_select = this._new_select;
		
		//if we have selected options in original tab
		if( org_options.length > 0 ){
		
			jQuery.each( org_options, function(){
				current_option_val = jQuery(this).val();
				//.find('option[value="01"]')
				new_option = new_select.find('option[value="' + current_option_val + '"]');
				if( new_option.length > 0 ) { //if new option exists
					new_option.attr("selected","selected");
				
				}
			});
		}
	});
	
	
	
	//append to population div id="populations_Tabs
	new_ea_copy.appendTo( jQuery("#effect_association_tabs") );
	
	//attach click listeners to this ea tab
	var which_content = "#effect_association_tab_" + new_tab_num;
	
	jQuery('#effect_association_tabs label.ea_tab_label[data-whichea="' + new_tab_num + '"]').parent().on("click", function() {
	
		//hide all subpops content
		jQuery('.one_ea_tab').hide();
		
		//add selected active class after removing it from all
		jQuery('label.ea_tab_label').removeClass('active');
		jQuery(this).children('label').addClass('active');

		jQuery(which_content + '.one_ea_tab').fadeIn();
		
	});
	
	//readd click listener to copy tabs (will include new dropdown)
	jQuery('.ea_copy_tab_button').on("click", copy_ea_tab );
	
	//refresh copytab options
	refresh_ea_copy_tab();
	
	//add clicklistener 'variables' textarea click listen based on whether "adjusted" is selected
	//turn off previous click listen and turn back on
	jQuery("input[name$='_result_type']").off("click", show_adjusted_variables );
	jQuery("input[name$='_result_type']").on("click", show_adjusted_variables );

	//create the multiselects again
	//ea multiselects
	jQuery(".ea_multiselect").multiselect({
		header: true,
		position: {my: 'left bottom', at: 'left top'},
		selectedText: '# of # checked',
		//selectedList: 4, 
		close: function( event, ui ){
			//multiselect_listener( jQuery(this) );
		}
	}); 
}

//TODO: can we combine this with the copy function?
//adds blank ea tab to page, copying hidden div
function add_empty_ea_tab(){

	var spinny = jQuery("#results_content .spinny");
	spinny.show();
	
	var num_current_tabs = jQuery("#effect_association_tabs ul li").length;
	var new_tab_num = num_current_tabs + 1;
	//remove click listener from copy tab while we're here
	jQuery('.ea_copy_tab_button').off("click", copy_ea_tab );
	
	//add a new tab to the ea tabs section
	jQuery('#effect_association_tabs ul').append("<li id='ea-tab-" + new_tab_num + "' class='ea_tab'><label class='ea_tab_label' for='ea-tab-" + new_tab_num + "' data-whichea='" + new_tab_num + "'>EA TAB " + new_tab_num + "</label></li>");
	
	//destroy the multiselects before we clone
	jQuery('.ea_multiselect').multiselect("destroy");
	
	//we will need to copy whichever tab is selected
	var new_ea_copy = jQuery('#effect_association_tab_template' ).clone(true,true);


	//vars
	//what prepend do we need? 
	var new_prepend = "ea_" + new_tab_num;
	//what prepend are we getting rid of?
	var old_prepend = "ea_template";
	var old_id = "";
	var new_id = "";
	var old_name = "";
	var new_name = "";
	
	//change subtitle
	//new_ese_copy.find("td.inner_table_header").html("<strong>Evaluation Sample - EXPOSED: " + new_tab_num + "</strong>");
		
	//change all the div ids that begin w/ ea_old#
	var all_old_ea_ids = new_ea_copy.find("[id^='" + old_prepend + "']");
	var all_old_ea_names = new_ea_copy.find("[name^='" + old_prepend + "']");
	
	//update overall div#
	new_id = 'effect_association_tab_' + new_tab_num;
	new_ea_copy.attr("id", new_id);
	new_ea_copy.attr("data-which_tab_num", new_tab_num);
	//overall_div_id.attr("id", new_id);
	
	
	//go through each div in the clone and update the id
	jQuery.each( all_old_ea_ids, function() {
		//get old id
		old_id = jQuery(this).attr("id");
		
		//replace old prepend w new, save to new_id
		new_id = old_id.replace(old_prepend, new_prepend);  
		
		//replace div id
		jQuery(this).attr("id", new_id);
	});
	
	//go through each name in the clone and update the name
	jQuery.each( all_old_ea_names, function() {
		//get old id
		old_name = jQuery(this).attr("name");
		
		//replace old prepend w new, save to new_id
		new_name = old_name.replace(old_prepend, new_prepend);  
		
		//update the name?
		jQuery(this).attr("name", new_name);
	});
		
	//append to effect_associations_tab
	new_ea_copy.appendTo( jQuery("#effect_association_tabs") );
	
	var which_content = "#effect_association_tab_" + new_tab_num;
	
	//attach click listeners to this ea tab
	jQuery('#effect_association_tabs label.ea_tab_label[data-whichea="' + new_tab_num + '"]').parent().on("click", function() {
	
		//hide all subpops content
		jQuery('.one_ea_tab').hide();
		
		//add selected active class after removing it from all
		jQuery('label.ea_tab_label').removeClass('active');
		jQuery(this).children('label').addClass('active');

		jQuery(which_content + '.one_ea_tab').fadeIn();
		
	});
	
	//readd click listener to copy tabs (will include new dropdown)
	jQuery('.ea_copy_tab_button').on("click", copy_ea_tab );
	
	//hide all tabs
	jQuery('label.ea_tab_label').removeClass('active');
	jQuery('.one_ea_tab').hide();
	
	//make this tab visible
	jQuery('#effect_association_tabs label.ea_tab_label[data-whichea="' + new_tab_num + '"]').addClass('active');
	jQuery(which_content + '.one_ea_tab').fadeIn();
	
	//refresh copytab options
	refresh_ea_copy_tab();
	
	//add clicklistener 'variables' textarea click listen based on whether "adjsuted" is selected
	//turn off previous click listen and turn back on
	jQuery("input[name$='_result_type']").off("click", show_adjusted_variables );
	jQuery("input[name$='_result_type']").on("click", show_adjusted_variables );

	//create the multiselects again
	//ea multiselects
	jQuery(".ea_multiselect").multiselect({
		header: true,
		position: {my: 'left bottom', at: 'left top'},
		selectedText: '# of # checked',
		//selectedList: 4, 
		close: function( event, ui ){
			//multiselect_listener( jQuery(this) );
		}
	}); 
		
	spinny.hide();
}
	
//update the ea copy tab ('.ea_copy_tab') options
function refresh_ea_copy_tab(){
	
	//how many tabs?
	var num_tabs = jQuery("#effect_association_tabs ul li").length;
	var tab_selects = jQuery(".ea_copy_tab");
	
	var txt = "";
	for( var i=1; i<=num_tabs; i++ ){
		txt += "<option value='" + i + "'>" + i + "</option>"
	
	}
	
	tab_selects.html( txt );
	
}

//for unselecting related radio fields
function uncheck_not_reported_related_fields(){

	//have we selected the checkbox? We don't care if it's unselected..
	if( jQuery(this).is(":checked") ){
		//get the id of this checkbox
		var not_reported_id = jQuery(this).attr("id");
		
		//which radio is related to this 'not reported' checkbox?
		var not_reported_radio = jQuery('form#study_form').find("[data-notreported_id='" + not_reported_id +"']");
		
		//for each radio (Yes and No), clear selection
		jQuery.each( not_reported_radio, function(){
			jQuery(this).prop('checked', false); 
		});
	}
	
}

//function to uncheck 'not reported' when a corresponding radio is selected
function uncheck_not_reported_checkboxes(){

	//have we selected the radio? We don't care if it's unselected..
	if( jQuery(this).is(":checked") ){
		//get the id of this checkbox
		var not_reported_id = jQuery(this).attr('data-notreported_id');
		
		//which radio is related to this 'not reported' checkbox?
		var not_reported_checkbox = jQuery('form#study_form').find("#" + not_reported_id );
		
		//for each radio (Yes and No), clear selection
		jQuery.each( not_reported_checkbox, function(){
			jQuery(this).prop('checked', false); 
		});
	}



}


//other populations checkbox checked should enable other populations description
function other_populations_textarea_enable(){

	//have we selected the checkbox? 
	var is_checked = jQuery(this).is(":checked");
	
	//get the id of this checkbox
	var other_pops_checkbox_id = jQuery(this).attr("id");
	
	//which radio is related to this 'not reported' checkbox?
	var other_pops_textarea = jQuery('form#study_form').find("[data-otherpopcheckbox_id='" + other_pops_checkbox_id +"']");
	
	//for each radio (Yes and No), clear selection
	jQuery.each( other_pops_textarea, function(){
		jQuery(this).prop('disabled', !is_checked); 
	});

}

//shows/hides measures extra textboxes (based on values in transtria_ajax.measures_w_text, derived from php function)
function measures_extra_textboxes(){

	var checked_objs = jQuery(this).multiselect('getChecked');
	var value = 0;
	
	//get parent of this multiselect
	var which_multi = jQuery(this);
	
	jQuery.each( checked_objs, function( i, v ){
	
		if( jQuery.inArray( parseInt( jQuery(v).val() ), transtria_ajax.measures_w_text_short ) !== -1 ){
			//if we have a match here, display the corresponding text boxes
			jQuery( which_multi ).parents('.one_ea_tab').find(".measures_textbox_tr[data-measures_val='" + jQuery(v).val() + "']").show();
		
		} 
	});
}

//init measures boxes on study load
function check_measures_selected(){

	//hide all extra textboxes, if showing
	jQuery('.measures_textbox_tr').hide();

	var measures_dds = jQuery("[id$='_result_measures']");
	
	jQuery.each( measures_dds, measures_extra_textboxes );

}

//for each indicator selected on an EA tab, show/render up to 5 selectable strategies for each + 1 direction
function ea_indicators_add_strategies_directions( incoming ){

	//jQuery(this) is the indicator dropdown?
	var which_indicators = incoming.multiselect("getChecked");
	//console.log( which_indicators );
	var which_ea_tab = incoming.parents('.one_ea_tab').attr("data-which_tab_num"); //what EA tab are we on?
	var which_tr_parent = incoming.parents('tr.ea_indicator');  //to add strategy/direction trs after this one

	//clone strategy and direction dropdowns (even if hidden later); will need to change id later
	var new_strategy = jQuery("#ea_template_result_strategy").clone( true );
	var new_direction = jQuery("#ea_template_result_indicator_direction").clone( true );
	new_strategy.removeClass("ea_table"); //we're not saving to the ea_table w this
	new_direction.removeClass("ea_table");
	new_strategy.addClass("result_strategy"); //to update the options w the original Strategy dropdown
	new_strategy.addClass("special_table"); //will let the save handler know that it is special
	new_direction.addClass("result_direction"); //will let the save handler know that it is special
	new_direction.addClass("special_table"); //will let the save handler know that it is special
	
	var new_id = "";
	var txt = ""; //to hold html
	var strategy_vals = []; //to hold all strategy values selected
	var strategy_value = 0;
	
	//for each indicator, get strategy value, put into array
	jQuery.each( which_indicators, function( i, v ){
	
		//strategy option values will be associated w new strategy and direction dropdowns
		strategy_value = jQuery(v).val(); //number of option
		strategy_vals.push( strategy_value );
		
	});
	
	//for each indicator, compare list of strategy values against existing and create/destroy as needed
	jQuery.each( which_indicators, function( i, v ){
		//value = jQuery(v).val() // this can be int or string
		//console.log( v );
		
		strategy_value = jQuery(v).val();
		
		//do we already have the addtnl Strategies and Direction for this indicator?
		var existing_strategy = jQuery("#effect_association_tab_" + which_ea_tab).find('tr.indicator_strategy[data-strategy_value="' + strategy_value + '"]');
		var existing_direction = jQuery("#effect_association_tab_" + which_ea_tab).find('tr.indicator_direction[data-direction_value="' + strategy_value + '"]');
		//console.log( existing_strategy );
		
		//if the current indicator does not have strategies in it (5), add html for it
		if( existing_strategy.length <= 0 ){
			for( var i = 1; i < 6; i++ ){
			
				txt += "<tr class='indicator_strategy' data-strategy_value='" + strategy_value + "'><td></td>"
				txt += "<td colspan='2'><label><strong>" + jQuery(v).attr("title") + ": Strategy " + i + "</strong></label></td>";
				
				//Add 5 strategy dropdowns with same..name?
				new_id = "ea_" + which_ea_tab + "_result_strategy_" + strategy_value;
				new_strategy.attr( "id", new_id );
				new_strategy.attr("data-strategy_value", strategy_value );
				new_strategy.attr("data-strategy_num", i );
				new_strategy.attr("data-this_ea_tab", which_ea_tab );
				
				var strategy_html = jQuery('<div>').append( new_strategy ).clone( true ).remove().html();
				
				//jQuery( txt ).append( new_strategy );
				txt += "<td>" + strategy_html + "</td>";
				txt += "<td></td></tr>";
				
			}
		}
		
		//if the current indicator does not have a direction (1), add html for it
		if( existing_direction.length <= 0 ){
			
			txt += "<tr class='indicator_direction' data-direction_value='" + strategy_value + "'><td></td>"
			txt += "<td colspan='2'><label><strong>" + jQuery(v).attr("title") + ": Direction</strong></label></td>";
			
			//Add 1 direction dropdown with same..name?  
			new_id = "ea_" + which_ea_tab + "_result_direction_" + strategy_value;
			new_direction.attr( "id", new_id );
			new_direction.attr("data-strategy_value", strategy_value );
			new_direction.attr("data-this_ea_tab", which_ea_tab );
			
			var direction_html = jQuery('<div>').append( new_direction ).clone( true ).remove().html();
			
			//jQuery( txt ).append( new_strategy );
			txt += "<td>" + direction_html + "</td>";
			txt += "<td></td></tr>";
				
		}
		
	});
	//console.log( strategy_vals );
	//remove indicator strategy and direction trs that are NOT in the 'list' of curernt indicators for this EA
	var all_existing_strategies = jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_strategy');
	var all_existing_directions = jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_direction');
	
	var this_strategy_num = 0;
	jQuery.each( all_existing_strategies, function( i, v ){
		this_strategy_num = jQuery(v).attr("data-strategy_value"); //could be int or string

		//if we have no indicator selected with this strategy number, remove the strategy
		if( jQuery.inArray( this_strategy_num, strategy_vals ) == -1 ){ //we have no indicator of this strategy number
			jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_strategy[data-strategy_value="' + this_strategy_num + '"]').remove();
			//update our strategy div list
			all_existing_strategies = jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_strategy')
		}
		
	});
	
	jQuery.each( all_existing_directions, function( i, v ){
		this_strategy_num = jQuery(v).attr("data-direction_value"); //could be int or string

		//if we have no indicator selected with this strategy number, remove the strategy
		if( jQuery.inArray( this_strategy_num, strategy_vals ) == -1 ){ //we have no indicator of this strategy number
			jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_direction[data-direction_value="' + this_strategy_num + '"]').remove();
			//update our direction div list
			all_existing_directions = jQuery('#effect_association_tab_' + which_ea_tab + ' tr.indicator_direction')
		}
	});

	//add html to page
	which_tr_parent.after( txt );
		
	//clear html holder
	txt = "";
	
	//adjust height of page
	adjust_form_height();
}



//adjust page height to largest div (of a few contenders)
function adjust_form_height(){

	//which tab is visible? (what of .main_tab also has class active?
	var which_active = jQuery('.main_tab_label.active').parent('.main_tab').find('.height_div');
	
	//console.log( which_active.height() );
	var new_height = which_active.height() + 200;
	jQuery('#main_tabs').css("height", new_height );
	
	
}

//helper function to get URL param
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


//On page load...

jQuery( document ).ready(function() {

	//load datetimepickers
	jQuery('#abstractorstarttime').datetimepicker();
	jQuery('#abstractorstoptime').datetimepicker();
	jQuery('#validatorstarttime').datetimepicker();
	jQuery('#validatorstoptime').datetimepicker();
	
	//set up our multiple checkboxes
	setup_multiselect();
	
	//get current study info
	get_current_study_info();
	
	//enable clicklisteners
	clickListen();
	
	//initialize ability status limiter
	//ea_clickListen();

	//in case we have an endnoteid param in the url, get the citation data
	get_citation_data();
	//initialize message on results page and then add change listener to stop time inputs
	//stop_time_validate();
	
	//initialize the ability status percent fields
	ability_status_initialize();
	
	/*
	jQuery.validator.setDefaults({
		debug: true,
		success: "valid"
		});
	jQuery( "#myform" ).validate({
		rules: {
			field: {
			  number: true
			}
		}
	}); */
	
	
});


