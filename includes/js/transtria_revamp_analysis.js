
/**** Doc to hold revamp'd javascript for analysis tab **/

function analysisClickListen(){

	//load in studies given study id
	jQuery("a#get_vars_by_group").on("click", get_vars_by_grouping );
	
	//run intermediate analysis for study group
	jQuery("a#run_intermediate_analysis").on("click", run_intermediate_analysis );
	
	//run final analysis for study group
	jQuery("a#run_analysis").on("click", run_analysis );
	jQuery("a#run_second_analysis").on("click", run_second_analysis );
	
	//show/hides
	jQuery("a#hide_im_table").on("click", toggle_var_table );
	jQuery("a#hide_direction_table").on("click", toggle_var_table );
	jQuery("a#hide_design_table").on("click", toggle_var_table );
	jQuery("a#hide_analysis_im_table").on("click", toggle_var_table );
	jQuery("a#hide_analysis_effect_table").on("click", toggle_var_table );
	jQuery("a#hide_analysis_population_table").on("click", toggle_var_table );
	
	jQuery("a#hide_component_table").on( "click", toggle_var_table );
	
	
	//when clicking on the analysis/intermediate vars tabs
	jQuery('.analysis_tab_label').on( "click", analysis_tab_toggle );

	//show/hide algorithms
	jQuery('#intermediate_vars_content #show_direction_algorithm').on( "click", algorithm_toggle );
	jQuery('#analysis_vars_content #show_effect_algorithm').on( "click", algorithm_toggle );

	//saving analysis vars
	jQuery('#analysis_vars_content .analysis_save').on("click", save_analysis_vars );




}

//tabs toggle for analysis var sections
function analysis_tab_toggle(){

	var whichtab = jQuery(this).data("whichanalysistab");
	
	//fade out all, remove active class from all l
	jQuery("#analysis_content .single_analysis_content").fadeOut();
	jQuery("label.analysis_tab_label").removeClass("active");
	
	jQuery("#" + whichtab + ".single_analysis_content").fadeIn();
	jQuery(this).addClass("active");
	//console.log(whichtab);
	
}

//toggle intermediate direction algorithm (could be a switch-case)
function algorithm_toggle(){

	//get which algorithm to show/hide from the data-whichalgorithm attr
	var which_alg = jQuery( this ).attr("data-whichalgorithm");
	
	if( jQuery("#" + which_alg).is(":visible") ){
		jQuery( "#" + which_alg ).hide();
		jQuery( this ).html("SHOW ALGORITHM DETAILS");
	} else {
		jQuery( "#" + which_alg ).show();
		jQuery( this ).html("HIDE ALGORITHM DETAILS");
	}

}

//toggles visibility of variable tables
function toggle_var_table(){

	var which_table_attr = jQuery( this ).attr("data-whichtable");
	var which_table = jQuery("table#" + which_table_attr);
	var which_label = jQuery( this ).attr("data-whichlabel");
	
	if( which_table.is(":visible") ){
		which_table.slideUp();
		jQuery( this ).html("SHOW " + which_label);
	} else {
		which_table.slideDown();
		jQuery( this ).html("HIDE " + which_label);
	}
	
}

//Get/Display all the vars!
function get_vars_by_grouping(){

	this_study_group = jQuery("select#StudyGroupingIDList").val();
	
	//update hidden input
	jQuery("input#secret_study_group").val( this_study_group );
	
	//user messages
	var spinny = jQuery('.analysis_messages .spinny');
	var usrmsg = jQuery('.analysis_messages .usr-msg');
	var usrmsgshell = jQuery('.analysis_messages');
	
	//where to add table data after success
	which_tr_parent = jQuery("table#intermediate_vars_im tr#data_parent");
	which_tr_parent_dir = jQuery("table#intermediate_vars_direction tr#data_parent");
	which_tr_parent_intermediate_design = jQuery("table#intermediate_vars_design tr#data_parent");
	which_tr_parent_intermediate_components = jQuery("table#intermediate_vars_components tr#data_parent");
	which_tr_parent_intermediate_complexity = jQuery("table#intermediate_vars_complexity tr#data_parent");
	which_tr_parent_intermediate_purpose = jQuery("table#intermediate_vars_purpose tr#data_parent");
	which_tr_parent_intermediate_summary = jQuery("table#intermediate_vars_summary tr#data_parent");
	which_tr_parent_intermediate_settingtype = jQuery("table#intermediate_vars_settingtype tr#data_parent");
	which_tr_parent_intermediate_pse = jQuery("table#intermediate_vars_pse tr#data_parent");
	which_tr_parent_intermediate_support = jQuery("table#intermediate_vars_support tr#data_parent");
	which_tr_parent_intermediate_opposition = jQuery("table#intermediate_vars_opposition tr#data_parent");
	which_tr_parent_intermediate_sustainability = jQuery("table#intermediate_vars_sustainability tr#data_parent");
	
	which_tr_parent_analysis_im = jQuery("table#analysis_vars_im tr#data_parent");
	which_tr_parent_analysis_effect = jQuery("table#analysis_vars_effect tr#data_parent");
	which_tr_parent_analysis_pops = jQuery("table#analysis_vars_population tr#data_parent");
	which_tr_parent_effectiveness_hr = jQuery("table#analysis_vars_effectiveness_hr tr#data_parent");
	
	//ajax data
	var ajax_action = 'get_im_dyads_and_data_by_group';
	var ajax_data = {
		'action': ajax_action,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'this_study_group' : this_study_group
	};
	
	if( this_study_group == -1 ){
		return;
	}
	
	//ajax get the studies for this group
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			usrmsg.html("Retrieving data, hang tight..." );
			usrmsgshell.fadeIn();
			spinny.fadeIn();
			
			//clear taable
			jQuery("table#intermediate_vars_im tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_direction tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_design tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_components tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_complexity tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_purpose tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_summary tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_settingtype tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_pse tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_support tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_opposition tr").not(".no_remove").remove();
			jQuery("table#intermediate_vars_sustainability tr").not(".no_remove").remove();
			
			jQuery("table#analysis_vars_im tr").not(".no_remove").remove();
			jQuery("table#analysis_vars_effect tr").not(".no_remove").remove();
			jQuery("table#analysis_vars_population tr").not(".no_remove").remove();
			jQuery("table#analysis_vars_effectiveness_hr tr").not(".no_remove").remove();
			
		}
	}).success( function( data ) {
		
		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
		
			//draw table#intermediate_vars_im (4 cols)
			var txt = "";
			var txt_dir = "";
			var txt_design = "";
			var txt_components = "";
			var txt_complexity = "";
			var txt_representativeness = "";
			var txt_purpose = "";
			var txt_summary = "";
			var txt_settingtype = "";
			var txt_pse = "";
			var txt_support = "";
			var txt_opposition = "";
			var txt_sustainability = "";
			
			var txt_a_im = "";
			var txt_a_effects = "";
			var txt_a_effects_hr = "";
			var txt_a_pops = "";
			
			
			//for each study
			if( data.intermediate_vars != undefined ){
				jQuery.each( data.intermediate_vars, function (){
					//for each row in intermediate table for this study
					var this_study_data = jQuery( this );
					jQuery.each( this_study_data, function(){
						//console.log( this );
						
						txt += "<tr>";
						//txt += "<td>" + this.StudyID + "</td>";
						txt += "<td>" + this.info_id + "</td>";
						//txt += "<td>" + this.ea_seq_id + "</td>"; //this info now embedded in info_id
						txt += "<td>" + this.indicator + "</td>";
						txt += "<td>" + this.measure + "</td>";
						txt += "<td>" + this.result_subpopulationYN + "</td>";
						if( this.result_subpop_unserial == false ){
							txt += "<td>no subpop</td>";
						} else {
							if( this.result_subpop_unserial[0].descr != undefined ){
								txt += "<td>" + this.result_subpop_unserial[0].descr + "</td>";
							} else {
								txt += "<tdsubpop error</td>";
							}
						}
						if( this.result_eval_unserial == false ){
							txt += "<td>no eval pop</td>";
						} else {
							if( this.result_eval_unserial[0].descr != undefined ){
								txt += "<td>" + this.result_eval_unserial[0].descr + "</td>";
							} else {
								txt += "<tdeval pop error</td>";
							}
						}
						
						txt += "</tr>";
						
						//also populate the ea direction table
						txt_dir += "<tr>"; 
						txt_dir += "<td>" + this.info_id + "</td>";
						txt_dir += "<td>" + this.indicator + "</td>";
						txt_dir += "<td>" + this.measure + "</td>";
						txt_dir += "<td>" + this.outcome_type + "</td>";
						txt_dir += "<td>" + this.calc_ea_direction + "</td>";
						
						txt_dir += "</tr>";
					
					});
					//console.log( jQuery(this ) );
				
				});
			} //end if intermediate_vars
			
			if( data.intermediate_vars_study != undefined ){
				//update header label
				jQuery("#intermediate_vars_content h3#intermediate_vars_header_text").html("Intermediate Variables: Study Grouping " + this_study_group );
				jQuery.each( data.intermediate_vars_study, function ( index, this_inter_study_data){
					//for each row in intermediate table for this study					
					txt_design += "<tr><td>" + index + "</td>";
					txt_design += "<td>" + this.StudyDesignValue + "</td>";
					txt_design += "<td>" + this.otherStudyDesign + "</td></tr>";
					//purpose
					txt_purpose += "<tr><td>" + index + "</td>";
					txt_purpose += "<td>" + this.intervention_purpose + "</td>";
					txt_purpose += "<td>" + this.interventionpurpose_notreported + "</td></tr>";
					//summary
					txt_summary += "<tr><td>" + index + "</td>";
					txt_summary += "<td>" + this.intervention_summary + "</td>";
					txt_summary += "<td>" + this.interventionsummary_notreported + "</td></tr>";
					//support
					txt_support += "<tr><td>" + index + "</td>";
					txt_support += "<td>" + this.support + "</td>";
					txt_support += "<td>" + this.support_notreported + "</td></tr>";
					//opposition
					txt_opposition += "<tr><td>" + index + "</td>";
					txt_opposition += "<td>" + this.opposition + "</td>";
					txt_opposition += "<td>" + this.opposition_notreported + "</td></tr>";
					//sustainability
					txt_sustainability += "<tr><td>" + index + "</td>";
					txt_sustainability += "<td>" + this.sustainability_flag + "</td>";
					txt_sustainability += "<td>" + this.sustainabilityplan_notreported + "</td></tr>";
					
					//multis
					if( this_inter_study_data.multi != undefined ){
						//complexity
						txt_complexity += "<tr><td>" + index + "</td>";
						var complex_string = ""; //for flattening arrays for display
						if( this_inter_study_data.multi.complexity != undefined ){
							if( this_inter_study_data.complexity_notreported == "Y" ){
								txt_complexity += "<td></td><td>Y</td></tr>";
							} else if( this_inter_study_data.multi.complexity.length > 0 ){
								//console.log( this_inter_study_data.multi.complexity );
								jQuery.each( this_inter_study_data.multi.complexity, function( complex_i, complex_v ){
									if( complex_v.length > 0 ){
										//console.log( complex_v);
										//console.log( complex_v[0]["value"] );
										complex_string += "\n" + complex_v[0]["value"] + ": " + complex_v[0]["descr"] + ";";
									}
								});
								txt_complexity += "<td>" + complex_string + "</td>";
								txt_complexity += "<td>N</td></tr>";
							} else {
								txt_complexity += "<td>No data</td>";
								txt_complexity += "<td>No data</td></tr>";
							}
							
						} else {
							txt_complexity += "<td>No data</td>";
							txt_complexity += "<td>No data</td></tr>";
						}
						
						//intervention components
						txt_components += "<tr><td>" + index + "</td>";
						complex_string = ""; //reset  
						if( this_inter_study_data.multi.intervention_components != undefined ){
							if( this_inter_study_data.interventioncomponents_notreported == "Y" ){
								txt_components += "<td></td><td>Y</td></tr>";
							} else if( this_inter_study_data.multi.intervention_components.length > 0 ){
								jQuery.each( this_inter_study_data.multi.intervention_components, function( complex_i, complex_v ){
									if( complex_v.length > 0 ){
										//console.log( complex_v);
										//console.log( complex_v[0]["value"] );
										complex_string += "\n" + complex_v[0]["value"] + ": " + complex_v[0]["descr"] + ";";
									}
								});
								txt_components += "<td>" + complex_string + "</td>";
								txt_components += "<td>N</td></tr>";
							} else {
								txt_components += "<td>No data</td>";
								txt_components += "<td>No data</td></tr>";
							}
							
						} else {
							txt_components += "<td>No data</td>";
							txt_components += "<td>No data</td></tr>";
						}
						
						//setting type
						txt_settingtype += "<tr><td>" + index + "</td>";
						complex_string = ""; //reset  
						if( this_inter_study_data.multi.setting_type != undefined ){
							if( this_inter_study_data.settingtype_notreported == "Y" ){
								txt_settingtype += "<td></td><td></td><td>Y</td></tr>";
							} else if( this_inter_study_data.multi.setting_type.length > 0 ){
								jQuery.each( this_inter_study_data.multi.setting_type, function( complex_i, complex_v ){
									if( complex_v.length > 0 ){
										//console.log( complex_v);
										//console.log( complex_v[0]["value"] );
										complex_string += "\n" + complex_v[0]["value"] + ": " + complex_v[0]["descr"] + ";";
									}
								});
								txt_settingtype += "<td>" + complex_string + "</td>";
								txt_settingtype += "<td>" + this_inter_study_data.other_setting_type + "</td>";
								txt_settingtype += "<td>N</td></tr>";
							} else {
								txt_settingtype += "<td>No data</td>";
								txt_settingtype += "<td>" + this_inter_study_data.other_setting_type + "</td>";
								txt_settingtype += "<td>No data</td></tr>";
							}
							
						} else {
							txt_settingtype += "<td>No data</td>";
							txt_settingtype += "<td>" + this_inter_study_data.other_setting_type + "</td>";
							txt_settingtype += "<td>" + this_inter_study_data.settingtype_notreported + "</td></tr>";
						}
						
						//pse components
						txt_pse += "<tr><td>" + index + "</td>";
						complex_string = ""; //reset  
						if( this_inter_study_data.multi.pse_components != undefined ){
							if( this_inter_study_data.psecomponents_notreported == "Y" ){
								txt_pse += "<td></td><td>Y</td></tr>";
							} else if( this_inter_study_data.multi.pse_components.length > 0 ){
								jQuery.each( this_inter_study_data.multi.pse_components, function( complex_i, complex_v ){
									if( complex_v.length > 0 ){
										//console.log( complex_v);
										//console.log( complex_v[0]["value"] );
										complex_string += "\n" + complex_v[0]["value"] + ": " + complex_v[0]["descr"] + ";";
									}
								});
								txt_pse += "<td>" + complex_string + "</td>";
								txt_pse += "<td>N</td></tr>";
							} else {
								txt_pse += "<td>No data</td>";
								txt_pse += "<td>No data</td></tr>";
							}
							
						} else {
							txt_pse += "<td>No data</td>";
							txt_pse += "<td>No data</td></tr>";
						}
						//console.log( this_inter_study_data.multi );
					}
					
				});
			} //end if intermedaite_vars_study
			
			if( data.analysis_vars != undefined ){
				//update header label
				jQuery("#analysis_vars_content h3#analysis_vars_header_text").html("Analysis Variables: Study Grouping " + this_study_group );
				jQuery.each( data.analysis_vars, function (){
					//for each row in intermediate table for this study
					var this_analysis_data = jQuery( this );
					jQuery.each( this_analysis_data, function(){
						//console.log( this );
						
						txt_a_im += "<tr>";
						txt_a_im += "<td>" + this.info_id + "</td>";
						txt_a_im += "<td>" + this.indicator + "</td>";
						txt_a_im += "<td>" + this.measure + "</td>";
						txt_a_im += "<td>" + this.info_id_list + "</td>";
						txt_a_im += "<td>" + this.net_effects + "</td>";
						txt_a_im += "<td>" + this.outcome_type + "</td>";
						txt_a_im += "<td>" + this.effectiveness_general + "</td>";
						
						txt_a_im += "</tr>";
						
						//TODO: populate the net effects table
						
						txt_a_effects += "<tr>";
						txt_a_effects += "<td class='analysis_id'>" + this.info_id + "</td>";
						txt_a_effects += "<td>" + this.indicator + "</td>";
						txt_a_effects += "<td>" + this.measure + "</td>";
						
						if( this.duplicate_ims == "N" ) { //static net effect, since it's coming from only 1 IM
							txt_a_effects += "<td>" + this.net_effects + "</td>";
						} else { //dropdown
							txt_a_effects += "<td><select class='net_effects'><option value='-1'> -- Select Net Effect or Association -- </option>";
							var net_effects_vars = this.net_effects;
							jQuery.each( transtria_ajax.effect_direction_lookup, function( i, v ){
								//console.log( v.descr );
								if( parseInt( net_effects_vars ) == parseInt( i ) ){
									var selected = true;
								} else {
									var selected = false;
								}
								txt_a_effects += "<option value='" + i + "'";
								//if we are on our selected value
								if( selected == true ){
									txt_a_effects += " selected='selected' ";
								}
								txt_a_effects += ">" + i + " - " + v.descr + "</option>";
							});
							txt_a_effects += "</select></td>";
						
						}
						
						txt_a_effects += "</tr>";
						//console.log( txt_a_effects );
						
						
						txt_a_effects_hr += "<tr>";
						txt_a_effects_hr += "<td class='analysis_id'>" + this.info_id + "</td>";
						txt_a_effects_hr += "<td>" + this.result_population_result + "</td>";
						txt_a_effects_hr += "<td>" + this.indicator + "</td>";
						txt_a_effects_hr += "<td>" + this.measure + "</td>";
						txt_a_effects_hr += "<td>" + this.effectiveness_hr + "</td>";
						txt_a_effects_hr += "</tr>";
						
						
						//TODO: populate the populations table
						txt_a_pops += "<tr>";
						txt_a_pops += "<td class='analysis_id'>" + this.info_id + "</td>";
						txt_a_pops += "<td>" + this.info_id_list_hr + "</td>";
						if( this.result_evaluation_population[0] != undefined ){
							if( this.result_evaluation_population[0].descr != undefined ){
								txt_a_pops += "<td>" + this.result_evaluation_population[0].descr + "</td>";
							} 
						} else {
							txt_a_pops += "<td>no eval pop</td>";
						}
						txt_a_pops += "<td>" + this.result_subpopulationYN + "</td>";
						if( this.result_subpopulation[0] != undefined ){
							if( this.result_subpopulation[0].descr != undefined ){
								txt_a_pops += "<td>" + this.result_subpopulation[0].descr + "</td>";
							}
						} else {
							txt_a_pops += "<td>no sub pop</td>";
						}
						//txt_a_pops += "<td>" + this.result_subpopulation + "</td>";
						txt_a_pops += "<td>" + this.result_population_result + "</td>";
						
						txt_a_pops += "</tr>";
						
						
						
						//TODO: populate the hr pops table
					
					});
					//console.log( jQuery(this ) );
				
				});
			} //end if analysis_vars
			
			//do we have study grouping-level vars we need to show (study design)
			if( data.study_grouping != undefined ){
				//console.log( data.study_grouping );
				
				//update StudyDesign select for this study group
				jQuery("select.analysis_study_design").val( data.study_grouping.study_design );
				jQuery("select.analysis_study_design_hr").val( data.study_grouping.study_design_hr );
				
				//update text
				if( data.study_grouping.study_design == 0 ){
					jQuery('h4#study_design_label').html("Study Design for Study Group " + this_study_group + ": no design selected" );
				} else {
					jQuery('h4#study_design_label').html("Study Design for Study Group " + this_study_group + ":" + data.study_grouping.study_design );
				}
			
			}
			
			
			//add html to page
			which_tr_parent.after( txt );
			which_tr_parent_dir.after( txt_dir );
			which_tr_parent_intermediate_design.after( txt_design );
			which_tr_parent_intermediate_components.after( txt_components );
			which_tr_parent_intermediate_complexity.after( txt_complexity );
			which_tr_parent_intermediate_purpose.after( txt_purpose );
			which_tr_parent_intermediate_summary.after( txt_summary );
			which_tr_parent_intermediate_settingtype.after( txt_settingtype );
			which_tr_parent_intermediate_pse.after( txt_pse );
			which_tr_parent_intermediate_support.after( txt_support );
			which_tr_parent_intermediate_opposition.after( txt_opposition );
			which_tr_parent_intermediate_sustainability.after( txt_sustainability );
	
			which_tr_parent_analysis_im.after( txt_a_im );
			which_tr_parent_analysis_effect.after( txt_a_effects );
			which_tr_parent_analysis_pops.after( txt_a_pops );
			which_tr_parent_effectiveness_hr.after( txt_a_effects_hr );
			
		}
		
		
	}).complete( function( data ) {

		console.log( data );
		usrmsgshell.fadeOut();
		spinny.fadeOut();
		
	});


}


function run_intermediate_analysis(){

	this_study_group = jQuery("select#StudyGroupingIDList").val();
	//update hidden input
	jQuery("input#secret_study_group").val( this_study_group );
	
	//user messages
	var spinny = jQuery('.analysis_messages .spinny');
	var usrmsg = jQuery('.analysis_messages .usr-msg');
	var usrmsgshell = jQuery('.analysis_messages');
	
	//ajax data
	var ajax_action = 'run_intermediate_analysis';
	var ajax_data = {
		'action': ajax_action,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'this_study_group' : this_study_group
	};
	
	//ajax get the studies for this group
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			usrmsg.html("Running Intermediate Analysis for Study Group: <strong>" + this_study_group + "</strong>, hang tight..." );
			usrmsgshell.fadeIn();
			spinny.fadeIn();
			
		}
	}).success( function( data ) {

		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
			//var parsed = JSON.parse( data );
			//console.log(parsed.responseText);
			console.log( data );
			
			
		}
		//var post_meat = data['single']; // = JSON.parse(data);
	}).complete( function( data ) {

		//console.log( data );
		usrmsg.html("Intermediate Calculations Complete for Study Group: <strong>" + this_study_group + "</strong>" );
		//usrmsgshell.fadeOut();
		spinny.fadeOut();
		
	});


}

//first analysis - from the intermediate table
function run_analysis(){

	this_study_group = jQuery("select#StudyGroupingIDList").val();
	
	//update hidden input
	jQuery("input#secret_study_group").val( this_study_group );
	
	//user messages
	var spinny = jQuery('.analysis_messages .spinny');
	var usrmsg = jQuery('.analysis_messages .usr-msg');
	var usrmsgshell = jQuery('.analysis_messages');
	
	//ajax data
	var ajax_action = 'run_analysis';
	var ajax_data = {
		'action': ajax_action,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'this_study_group' : this_study_group
	};
	
	//ajax get the studies for this group
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			usrmsg.html("Running Analysis for Study Group: <strong>" + this_study_group + "</strong>, hang tight..." );
			usrmsgshell.fadeIn();
			spinny.fadeIn();
			
		}
	}).success( function( data ) {
		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
			//var parsed = JSON.parse( data );
			console.log(data);
		}
		//var post_meat = data['single']; // = JSON.parse(data);
	}).complete( function( data ) {
		//console.log( data );
		usrmsg.html("Analysis Complete for Study Group: <strong>" + this_study_group + "</strong>" );
		//usrmsgshell.fadeOut();
		spinny.fadeOut();
	});
}

//second analysis - considering the form vars
function run_second_analysis(){

	this_study_group = jQuery("select#StudyGroupingIDList").val();
	
	//update hidden input
	jQuery("input#secret_study_group").val( this_study_group );
	
	//user messages
	var spinny = jQuery('.analysis_messages .spinny');
	var usrmsg = jQuery('.analysis_messages .usr-msg');
	var usrmsgshell = jQuery('.analysis_messages');
	
	//ajax data
	var ajax_action = 'run_second_analysis';
	var ajax_data = {
		'action': ajax_action,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'this_study_group' : this_study_group
	};
	
	//ajax get the studies for this group
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			usrmsg.html("Re-Running Analysis with form variables (Study Design, Net effects) for Study Group: <strong>" + this_study_group + "</strong>, hang tight..." );
			usrmsgshell.fadeIn();
			spinny.fadeIn();
			
		}
	}).success( function( data ) {
		
		//get vars again
		get_vars_by_grouping();
		
		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
			//var parsed = JSON.parse( data );
			console.log(data);
		}
		//var post_meat = data['single']; // = JSON.parse(data);
	}).complete( function( data ) {
		//console.log( data );
		//usrmsgshell.fadeOut();
		//spinny.fadeOut();
	});
}

//saves analysis vars //TODO: make this apply to 'all' somehow
function save_analysis_vars(){
	//which analysis save button did we touch?
	var which_var_raw = jQuery(this).attr('data-whichvars'); //should match the select(s) that need savin'
	
	//tODO: make this more efficient on the front-end.
	if( which_var_raw == "analysis_study_design" ){
		var which_vars = ["analysis_study_design", "analysis_study_design_hr"];
	} else {
		var which_vars = which_var_raw;
	}
	
	var which_action = jQuery(this).attr('data-whichsave'); //let's us know at which level to save this analysis var
	var which_msg_class = jQuery(this).attr('data-whichmsg'); //let's us know at which level to save this analysis var
	var which_msg = jQuery("#" + which_msg_class);
	if( which_msg.length == 0 ){
		which_msg = jQuery(".analysis_messages .usr-msg"); //hmm, not sure about this check, but NO TIME
	}
	
	var which_id = 0;
	var selected_val = 0;
	var this_save_vars = {};
	var all_save_vars = {};
	
	if( which_action == "save_analysis_vars" ){
		//get all the selects of this class
		jQuery.each( jQuery('select.' + which_vars ), function(){
			//get analysis id
			which_id = jQuery(this).parent('td').siblings('td.analysis_id').html();
			
			//get which value is selected
			selected_val = jQuery(this).val();
			if( selected_val != '-1' ){
				//add this value to the array
				this_save_vars[ which_id ] = selected_val;
			}
			
		});
		//console.log( one_var );
		
		all_save_vars[ which_vars ] = this_save_vars;
		
	} else { //studygroup-level savin' // TODO, 23dec, when does this happen?
	
		/* //23dec2015
		selected_val = jQuery('select.' + which_vars ).val();
		
		if( selected_val == '-1' ){ //don't waste my time
			return;
		}
		all_save_vars[ which_vars ] = selected_val;
		*/
		jQuery.each( which_vars, function(){
			//get analysis id
			which_id = this;
			
			//get which value is selected
			selected_val = jQuery("select." + this).val();
			if( selected_val != '-1' ){
				//add this value to the array
				//this_save_vars[ which_id ] = selected_val;
				all_save_vars[ which_id ] = selected_val;
			}
			
		});
	
	}
	
	//console.log( all_save_vars );
	
	//set up ajax data
	//change action depending on whether it's analysis-id-specific vars or studygroup-specific vars
	var ajax_action = which_action; //'save_analysis_vars';
	var ajax_data = {
		'action': ajax_action,
		'transtria_nonce' : transtria_ajax.ajax_nonce,
		'analysis_vars' : all_save_vars,
		'study_group' : jQuery("input#secret_study_group").val()
	};
	
	//AJAX that noise
	jQuery.ajax({
		url: transtria_ajax.ajax_url, 
		data: ajax_data, 
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			which_msg.html("Saving...");
			//usrmsg.html("Retrieving data, hang tight..." );
			//usrmsgshell.fadeIn();
			//spinny.fadeIn();
			
			
		}
	}).success( function( data ) {
		
		if( data == "0" || data == 0 )  {
			//console.log('what');=
			return;
		} else {
		
		}
	}).complete( function( data ) {

		//console.log( data );
		which_msg.html("Saved!");
		//usrmsgshell.fadeOut();
		//spinny.fadeOut();
		
	}).error( function( data ) {
		which_msg.html("Oh no, error!");
	});;
}













jQuery( document ).ready(function() {

	analysisClickListen();
	
});