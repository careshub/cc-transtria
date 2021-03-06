<?php
/**
 * CC Transtria Extras - Database Bridge
 *
 * @package   CC Transtria Extras
 * @author    CARES staff
 * @license   GPL-2.0+
 * @copyright 2014 CommmunityCommons.org
 */

/**
 * Returns all study data given a single study id
 *
 * @param int. Study ID.
 * @return array
 */
function cc_transtria_get_all_data_one_study( $study_id = null ){

	$meta_data = cc_transtria_get_study_metadata( $study_id );
	$single_data = cc_transtria_get_single_study_data( $study_id );

	$pops_data_single = cc_transtria_get_pops_study_data_single( $study_id );
	$pops_data_multiple = cc_transtria_get_pops_study_data_multiple( $study_id );
	
	$ea_data = cc_transtria_get_ea_tab_data_for_study( $study_id );

}

/**
 * Returns metadata given a study id (num ese tabs, num ea tabs)
 *
 * @param int. Study ID.
 * @return array
 */
function cc_transtria_get_study_metadata( $study_id = null ){

	global $wpdb;
	
	//TODO, use wp->prepare
	$question_sql = 
		"
		SELECT variablename, value
		FROM $wpdb->transtria_metadata
		WHERE `StudyID` = $study_id
		AND 
			( `variablename` = 'ea tabCount' OR `variablename` = 'ese tabCount' OR `variablename` = 'indicatorNum')
		";
		
	$form_rows = $wpdb->get_results( $question_sql, OBJECT );
	return $form_rows;

}


/**
 * Returns array of string->values for single data in studies table
 *
 * @since    1.0.0
 * @return 	array
 */
function cc_transtria_get_single_study_data( $study_id = null ){
	
	global $wpdb;
	
	//TODO, use wp->prepare
	$question_sql = 
		"
		SELECT * 
		FROM $wpdb->transtria_studies
		WHERE `StudyID` = $study_id
		";
		
	$form_rows = $wpdb->get_results( $question_sql, ARRAY_A ); //TODO: is ARRAY the best type to use here?
	
	//go through each field and make sure it lines up with div ids
	$reindexed_form_rows = cc_transtria_match_div_ids_to_studies_columns( current( $form_rows ) );
	
	//return current($form_rows);
	return $reindexed_form_rows;

}

/**
 * Returns 'special data'
 *
 */
function cc_transtria_get_special_data( $study_id = null ){

	global $wpdb;
	
	//TODO, use wp->prepare
	$question_sql = 
		"
		SELECT seq, indicator_strategies_directions
		FROM $wpdb->transtria_effect_association
		WHERE `StudyID` = $study_id
		";
		
	$form_rows = $wpdb->get_results( $question_sql, OBJECT );
	$return_info = array();
	
	//unserialize the data
	foreach( $form_rows as $form_row ){
		
		$return_info[ $form_row->seq ] = unserialize( $form_row->indicator_strategies_directions );
	}
	
	return $return_info;


}


/**
 * Saves ea/ese tab number to metadata table
 * 
 * @param int, int. 
 * @return string. Error message?
 */
function cc_transtria_save_to_metadata_table( $study_id, $num_ese_tab, $num_ea_tab, $num_other_ind, $num_other_out ){
	
	global $wpdb;
	
	$error_array;
	
	//prep population types we care about
	$ese_tabs_to_db = 0;
	$ea_tabs_to_db = 0;
	$other_ind_to_db = 0;
	
	if( !is_null( $num_ese_tab ) && ( $num_ese_tab != "" ) && ( $num_ese_tab != "NaN" ) && !is_nan( $num_ese_tab ) ){
		$error_array[]  = 'ese org: ' . $num_ese_tab;
		$ese_tabs_to_db = (int)$num_ese_tab + 1;  //0-indexed on form, 1-indexed in db.
	} 
	
	if( !is_null( $num_ea_tab ) && ( $num_ea_tab != "" ) ){
		$ea_tabs_to_db = (int)$num_ea_tab;  //0-indexed on form, 1-indexed in db.
	}
	
	if( !is_null( $num_other_ind ) && ( $num_other_ind != "" ) ){
		$other_ind_to_db = (int)$num_other_ind;  //0-indexed on form, 1-indexed in db.
	} 
	
	if( !is_null( $num_other_out ) && ( $num_other_out != "" ) ){
		$other_out_to_db = (int)$num_other_out;  //0-indexed on form, 1-indexed in db.
	} 
	
	
	//$error_array[] = '$ese_tabs_to_db: ' . $ese_tabs_to_db;
	//$error_array[] = '$ea_tabs_to_db: ' . $ea_tabs_to_db;

	//not working...? : wpdb->replace will Replace a row in a table if it exists or insert a new row in a table if the row did not already exist. 		
	//ese tabCount: replace ese tab count
	$ese_table_row_name = "ese tabCount";
	
	//first, delete old rows
	$ese_del_num_row = $wpdb->delete( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $ese_table_row_name
		)
	);
	
	$ese_num_row = $wpdb->insert( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $ese_table_row_name,
			'value' => $ese_tabs_to_db
		),
		array( 
			'%d',
			'%s',
			'%d'
		) 
	);

	if( $ese_num_row === false ){
		$error_array[] = "Error: ese num row could not be inserted in metadata table in db, study_id: " . $study_id;
	} else {
		$error_array[] = "Num ese rows updated: " . $ese_num_row;	
	}
	
			
	//ea tabCount: replace ea tab count
	$ea_table_row_name = "ea tabCount";
	//first, delete old rows
	$ea_del_num_row = $wpdb->delete( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $ea_table_row_name
		)
	);
	
	$ea_num_row = $wpdb->insert( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $ea_table_row_name,
			'value' => $ea_tabs_to_db
		),
		array( 
			'%d',
			'%s',
			'%d'
		) 
	);
	
	if( $ea_num_row === false ){
		$error_array[] = "Error: ea num row could not be inserted in metadata table in db, study_id: " . $study_id;
	} else {
		$error_array[] = "Num ea rows updated: " . $ea_num_row ;	
	}

	
	//indicatorNum: replace 'other indicator count' count
	$other_ind_row_name = "indicatorNum";
	//first, delete old rows
	$other_ind_del_num_row = $wpdb->delete( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $other_ind_row_name
		)
	);
	
	$other_ind_num_row = $wpdb->insert( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $other_ind_row_name,
			'value' => (int)$other_ind_to_db
		),
		array( 
			'%d',
			'%s',
			'%d'
		) 
	);
	
	if( $other_ind_num_row === false ){
		$error_array[] = "Error: other_ind_num_row could not be inserted in metadata table in db, study_id: " . $study_id .', other ind num: ' . $other_ind_to_db;
	} else {
		$error_array[] = "Num other ind rows updated: " . $other_ind_num_row . ", study_id: " . $study_id;	
	}
	
	
	//outcomeNum: update number of other outcomes created  
	//replace 'other indicator count' count
	$other_out_row_name = "outcomeNum";
	//first, delete old rows
	$other_out_del_num_row = $wpdb->delete( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $other_out_row_name
		)
	);
	
	$other_out_num_row = $wpdb->insert( 
		$wpdb->transtria_metadata, 
		array( 
			'StudyID' => (int)$study_id,
			'variablename' => $other_out_row_name,
			'value' => (int)$other_out_to_db
		),
		array( 
			'%d',
			'%s',
			'%d'
		) 
	);
	
	if( $other_out_num_row === false ){
		$error_array[] = "Error: other_out_num_row could not be inserted in metadata table in db, study_id: " . $study_id .', other out num: ' . $other_out_to_db;
	} else {
		$error_array[] = "Num other out rows updated: " . $other_out_num_row . ", study_id: " . $study_id;	
	}
	
	
	return $error_array;
	
}

/**
 * Saves single study data to studies tables
 * 
 * @param array. Associative array of db_label => incoming value
 * @return string. Error message?
 */
function cc_transtria_save_to_studies_table( $studies_data, $study_id, $new_study = false ){
	
	global $wpdb;
		
	//TODO: if this works, combine things
	if( $new_study == false ){
	
		$studies_where = array(
			'StudyID' => $study_id 
		);
		
		
		//if we have [board] values set by the form, update the table
		// wpdb->update is perfect for this. Wow. Ref: https://codex.wordpress.org/Class_Reference/wpdb#UPDATE_rows
		if ( !empty ( $studies_data ) ) {
			$num_study_rows_updated = $wpdb->update( $wpdb->transtria_studies, $studies_data, $studies_where, $format = null, $where_format = null );
		}
		
		if( $num_study_rows_updated === false ){
			return "Error: new study data could not be added to db";
		} else {
			return $num_study_rows_updated; //should be 1
		}
		
	} else {
		//insert
		//Hmmm...maybe just study id and then update, since not all fields are being used...
		$result = $wpdb->insert( 
			$wpdb->transtria_studies, 
			array( 
				'StudyID' => (int)$study_id
			),
			array( 
				'%d'
			) 
		);
		
		if( $result === false ){
			return "Error: new study could not be initialized in db";
		}
		
		$studies_where = array(
			'StudyID' => $study_id 
		);
		$dummy_studies = array(
			'abstractor' => "04"
			);
		
		
		if ( !empty ( $studies_data ) ) {
			$num_study_rows_updated = $wpdb->update( $wpdb->transtria_studies, $studies_data, $studies_where, $format = null, $where_format = null );
		}
		
		if( $num_study_rows_updated === false ){
			//var_dump( $studies_data );
			return "Error: new study data could not be added to db for new study";
		} else {
			//var_dump( $studies_data );
			return $num_study_rows_updated; //should be 1 (or 0 if nothing actually updated/error. Not super-useful.)
		}
	}

}

/**
 * Saves single study data to pops table
 * 
 * @param array, int, bool, int. Associative array of db_label => incoming value
 * @return string. Error message?
 */
function cc_transtria_save_to_pops_table_raw( $studies_data, $study_id, $new_study = false, $num_pops_tab ){
	
	global $wpdb;
	
	//prep population types we care about
	$pops_types = cc_transtria_get_basic_pops_types();
	if( !is_null( $num_pops_tab ) && ( $num_pops_tab != "" ) ){
		//add to normal pops
		for( $i = 0; $i <= $num_pops_tab; $i++ ){
			$pops_types[] = 'ese' . $i;
		
		}
	} 
	
	$parsed_studies_data;
	$notparsed_studies_data;
	$new_index;
	
	//parse incoming array by pop type
	foreach( $studies_data as $data_piece_index => $data_piece_value ){
		
		foreach( $pops_types as $pop_type ){
			
			if( substr( $data_piece_index, 0, strlen($pop_type . '_') ) === ( $pop_type . '_' ) ) {
				$parsed_studies_data[ $pop_type ][ $data_piece_index ] = $data_piece_value;
			} else {
				$notparsed_studies_data[ $data_piece_index ] = $data_piece_value;
			}
		}
	}
	
	//take each poptype array and convert to db label
	foreach( $parsed_studies_data as $pop_type => $pop_array ){
	
		$new_index[ $pop_type ] = cc_transtria_match_div_ids_to_pops_columns_single( $pop_type, $pop_array, true );

	}
	
	//TODO: if this works, combine things
	if( $new_study == false ){
	
		$error_array;
		
		foreach( $new_index as $pop_type => $index_val ){
			//we need to check for the existance of these rows, yeah?
			
			$pops_where = array(
				'StudyID' => $study_id,
				'PopulationType' => $pop_type
			);
			
			$populations_sql = $wpdb->prepare( 
				"
				SELECT      *
				FROM        $wpdb->transtria_population
				WHERE		StudyID = %d
				AND 		PopulationType = %s
				",
				$study_id,
				$pop_type
			); 
			
			//run query
			$form_rows = $wpdb->get_row( $populations_sql, ARRAY_A );
			//$error_array[] = 'form rows for: ' . $pop_type . ' = ' . $form_rows;
			
			//if there is no row returned for this pop_type, we need to insert one before updating
			if( $form_rows === null ){
			
				//insert the row first!
				$new_pop_row = $wpdb->insert( 
					$wpdb->transtria_population, 
					array( 
						'StudyID' => (int)$study_id,
						'PopulationType' => $pop_type
					),
					array( 
						'%d',
						'%s'
					) 
				);
				
				if( $new_pop_row === false ){
					$error_array[] = "Error: new pop " . $pop_type . " could not be initialized in population table in db";
				}
			
			}
			
			//update each row
			// wpdb->update is perfect for this. Wow. Ref: https://codex.wordpress.org/Class_Reference/wpdb#UPDATE_rows
			if ( !empty ( $index_val ) ) {
				$num_study_rows_updated = $wpdb->update( $wpdb->transtria_population, $index_val, $pops_where, $format = null, $where_format = null );
				
				
			} 
				
			if( $num_study_rows_updated === false ){
				$error_array[] = "Error: new pops data could not be added to db for pop type " . $pop_type . " and existing study id";
			} else {
				$error_array[] = $pop_type . ": " . $num_study_rows_updated; //should be 1
			}
				
		}
		
		return $error_array;
		
	} else {
	
		$error_array;
		foreach( $new_index as $pop_type => $index_val ){
			
			//insert new study in table!
			//Hmmm...maybe just study id and then update, since not all fields are being used...
			$result = $wpdb->insert( 
				$wpdb->transtria_population, 
				array( 
					'StudyID' => (int)$study_id,
					'PopulationType' => $pop_type
				),
				array( 
					'%d',
					'%s'
				) 
			);
			
			if( $result === false ){
				$error_array[] = "Error: new pop " . $pop_type . " could not be initialized in population table in db";
			}
			
			$pops_where = array(
				'StudyID' => $study_id,
				'PopulationType' => $pop_type
			);
			
			
			//update newly inserted ro
			if ( !empty ( $index_val ) ) {
				$num_study_rows_updated = $wpdb->update( $wpdb->transtria_population, $index_val, $pops_where, $format = null, $where_format = null );
			} 
			
			if( $num_study_rows_updated === false ){
				$error_array[] = "Error: new population data for " . $pop_type . " could not be added to db for new study";
			} else {
				$error_array[] = $pop_type . ": " . $num_study_rows_updated; //should be 1
			}
		}
		
		
		return $error_array;
		
	}
	
	

}

/**
 * Saves single study data to ea table
 * 
 * @param array, int, bool(opt), int. Associative array of db_label => incoming value
 * @return string. Error message?
 */
function cc_transtria_save_to_ea_table_raw( $studies_data, $study_id, $new_study = false, $num_ea_tab ){
	
	global $wpdb;
	
	$parsed_studies_data;
	$notparsed_studies_data;
	$new_index;
	
	
	//parse incoming array by ea number
	foreach( $studies_data as $data_piece_index => $data_piece_value ){
		
		for( $i = 1; $i <= $num_ea_tab; $i++ ){ //foreach( $pops_types as $pop_type ){
			
			$this_ea_tab = 'ea_' . $i; //put into ea_# format
			
			if( substr( $data_piece_index, 0, strlen($this_ea_tab . '_') ) === ( $this_ea_tab . '_' ) ) {
				//remove prepend from $data_piece_index
				//$data_piece_index = str_replace( $this_ea_tab, '', $data_piece_index );
				$parsed_studies_data[ $this_ea_tab ][ $data_piece_index ] = $data_piece_value;
			} else {
				$notparsed_studies_data[ $data_piece_index ] = $data_piece_value;
			}
		}
	}
	
	//take each ea num array and convert to db label
	foreach( $parsed_studies_data as $ea_type => $ea_data ){
	
		$new_index[ $ea_type ] = cc_transtria_match_div_ids_to_ea_columns_single( $ea_type, $ea_data, true );
	
	}
	
	$error_array;
		
	//TODO: if this works, combine things
	if( $new_study == false ){
	
		//first, delete old rows 
		$ea_del_row = $wpdb->delete( 
			$wpdb->transtria_effect_association, 
			array( 
				'StudyID' => (int)$study_id
			)
		);
			
		foreach( $new_index as $which_ea_tab => $index_val ){
			//get ea tab number for 'seq' in db 
			$which_ea_tab_num = str_replace( 'ea_', '', $which_ea_tab );
			$index_val['StudyID'] = (int)$study_id;
			$index_val['seq'] = (int)$which_ea_tab_num;
			
			
			$ea_num_row = $wpdb->insert( 
				$wpdb->transtria_effect_association, 
				$index_val
			);
			
			if( $ea_num_row === false ){
				$error_array[] = "Error: new ea data could not be inserted to db for ea seq " . $which_ea_tab_num . " and existing study id, index val: " . $index_val;
			} else {
				$error_array[] = $which_ea_tab_num . ": " . $ea_num_row; //should be 1
			}
				
		}
		
		return $error_array;
		
	} else {
	
		//first, delete old rows just in case? This should be none
		$ea_del_row = $wpdb->delete( 
			$wpdb->transtria_effect_association, 
			array( 
				'StudyID' => (int)$study_id
			)
		);
		
		foreach( $new_index as $which_ea_tab => $index_val ){
			//get ea tab number for 'seq' in db 
			$which_ea_tab_num = str_replace( 'ea_', '', $which_ea_tab );
			$index_val['StudyID'] = (int)$study_id;
			$index_val['seq'] = (int)$which_ea_tab_num;
			
			
			$ea_num_row = $wpdb->insert( 
				$wpdb->transtria_effect_association, 
				$index_val
			);
			
				
			if( $ea_num_row === false ){
				$error_array[] = "Error: new ea data could not be inserted to db for ea seq " . $which_ea_tab_num . " and existing study id";
			} else {
				$error_array[] = $which_ea_tab_num . ": " . $ea_num_row; //should be 1
			}
				
		}
		
		return $error_array;
		
	}
	
	

}

/**
 * Saves multiple study data (from multiselects) to code results tables
 * 
 * @param array, int, bool (opt). Associative array of db_label => incoming value
 * @return string. Error message?
 */
function cc_transtria_save_to_code_results( $studies_data, $study_id ){
	
	global $wpdb;
	
	$parsed_studies_data;
	$notparsed_studies_data;
	$new_index;

	//first, delete old rows 
	$ea_del_row = $wpdb->delete( 
		$wpdb->transtria_code_results, 
		array( 
			'ID' => (int)$study_id
		)
	);
	//output
	$error_array;

	if( !( is_null( $studies_data ) ) && !( empty( $studies_data ) ) ) {
		//convert incoming labels to db-specific labels
		$parsed_studies_data = cc_transtria_match_div_ids_to_multiple_columns( $studies_data, true );


		//next, grab array of all code numbers = code names
		$codetype_sql =
			"
			SELECT codetypeID, codetype
			FROM $wpdb->transtria_codetype
			order by codetypeID
			"
		;

		$codetypes_by_id = $wpdb->get_results( $codetype_sql, OBJECT_K );

		//massage incoming codetype array to be number => label
		$parsed_codetypes;
		foreach( $codetypes_by_id as $codetypeID => $weird_array ){
			$parsed_codetypes[ (int)$codetypeID ] = $weird_array->codetype;	
		}

		//take each incoming study_label and map to code type id, then insert into db
		foreach( $parsed_studies_data as $code_name => $code_val_array ){
			//get db label
			$codenum = array_search( $code_name, $parsed_codetypes );
			
			$error_array[] = 'code_val_array for $code_name: ' . $code_name . ', and $codenum: ' . $codenum . ' : ' . $code_val_array;
			//now, cycle through code_val_array and insert to code results table
			if( !empty( $code_val_array ) ) {
			
				foreach( $code_val_array as $code_val ){
					
					$index_val['ID'] = (int)$study_id;
					$index_val['codetypeID'] = (int)$codenum;
					$index_val['result'] = $code_val;
						
					$code_result_row = $wpdb->insert( 
						$wpdb->transtria_code_results, 
						$index_val,
						array(
							'%d',
							'%d',
							'%s'
						)
					);
						
					if( $code_result_row === false ){
						$error_array[] = "Error: new code result db insert error for codelabel: " . $code_name . ", codetypeID: " . $codenum . " and study id";
					} else {
						$error_array[] = $code_val . ": " . $code_result_row; //should be 1
					}
				}
			}
			
		}
	} else {
		$error_array[] = 'No multiselects selected';
	}
	
	return $error_array;
		
	

}

/**
 * Saves 'special' data that exists outside of previous paradigms (and therefore needs special handling)
 *
 * @param array, int.  Data, Study ID.
 * @return string. Error message.
 */
function cc_transtria_save_special_data( $studies_data, $study_id ){

	global $wpdb;
	$return_info = array(); //just a holder for now
	$cerealized = array();
	
	//first, parse what's coming in.  As of now, we've got arrays indexed by EA tabs
	foreach( $studies_data as $ea_tab => $data ){
	
		$return_info[ $ea_tab ] = $data; //temp
		
		//serialize since we are putting into single field in ea_table
		$cerealized[ $ea_tab ] = serialize( $data );
	
	}
	
	//put into database - ea_table: indicator_strategies_directions
	foreach( $cerealized as $ea_tab => $string ){
	
		$data = array( 
			'indicator_strategies_directions' => $string 
		);
		
		$where = array( 
			'StudyID' => $study_id,	
			'seq' => $ea_tab
		);

		$result = $wpdb->update( $wpdb->transtria_effect_association, $data, $where, $format = null, $where_format = null );
		
		if( $result === false ){
			$error_array[ $ea_tab ] = "Error: having trouble saving EA tab-specific Strategies/Directions, EA tab: " . $ea_tab;
		} else {
			$error_array[ $ea_tab ] = $result;
		}
	
	}
	
	return $error_array;

}


/******* get multiple data *******/

/**
 * Returns array of all multiple data for a study
 *
 * @param int. Study ID.
 * @return array of arrays. Codetype div names => selected values
 *
 */
function cc_transtria_get_study_data_multiple( $study_id = null ){


	//get the selected values (results) for this study from code_results (then translate to human language from code_tbl!)
	$results = cc_transtria_get_all_code_results_by_study_id( $study_id );
	
	//cycle through array keys are replace with lookup table keys.
	$results = cc_transtria_match_div_ids_to_multiple_columns( $results );
 
 //var_dump( $results );
	return $results;
}

/**
 * Returns array of string->values for population data in populations table
 *
 * @since    1.0.0
 * @return 	array
 */
function cc_transtria_get_pops_study_data_single( $study_id = null ){

	global $wpdb;
	
	//how many ese tabs do we have?
	$meta_sql = $wpdb->prepare( 
		"
		SELECT      value
		FROM        $wpdb->transtria_metadata
		WHERE		StudyID = %s 
		AND 		variablename = 'ese tabCount'
		",
		$study_id
	); 
	
	$ese_tab_count = $wpdb->get_results( $meta_sql, ARRAY_A );
	$ese_tab_count = intval( $ese_tab_count[0]['value'] ); //e.g., if = 2, look for ese0, ese1
	
	$which_pops = cc_transtria_get_basic_pops_types();
	
	//because ese tabs are zero-indexed (meaning: just one addtnl ese tab = ese0):
	for( $i=0; $i < $ese_tab_count; $i++){
		//append ese tab name to $which_pops
		$current_ese_tab = 'ese' . $i;
		array_push( $which_pops, $current_ese_tab );
	}
	
	$all_pops_tabs; //instantiate empty array to hold all the pops data
	
	foreach( $which_pops as $which_pop ){
		//there are multiple rows in the pops table per study
		$populations_sql = $wpdb->prepare( 
			"
			SELECT      *
			FROM        $wpdb->transtria_population
			WHERE		StudyID = %s 
			AND 		PopulationType = %s
			",
			$study_id,
			$which_pop
		); 
		
		//run query
		$form_rows = $wpdb->get_results( $populations_sql, ARRAY_A );
		
		//var_dump( $form_rows );
		
		//put label of form rows in div id form
		$new_form_rows = cc_transtria_match_div_ids_to_pops_columns_single( $which_pop, current( $form_rows) );
		
		//add to master array
		$all_pops_tabs[ $which_pop ] = $new_form_rows;
		//$all_pops_tabs[ $which_pop ] = 't';
		
	}
	
	//go through each field and make sure it lines up with div ids
	//$reindexed_form_rows = cc_transtria_match_div_ids_to_pops_columns_single( current( $form_rows ) );
	
	return $all_pops_tabs;


}


//TODO: are we using this one at all??
/**
 * Returns array of string->values for population data in code_results table (drop downs)
 *
 * @since    1.0.0
 * @return 	array
 */
function cc_transtria_get_pops_study_data_multiple( $study_id = null ){

	$what_pops = cc_transtria_get_all_pops_type_for_study( $study_id );
	
	//get text ids for pops stuff
	$pops_ids = array_flip( cc_transtria_get_multiple_dropdown_ids_populations() ); //db => div_ids
	$pops_keys_only = array_keys( $pops_ids ); //we only need the db number right now?
	
	//get lookup codes
	$lookup_codes = cc_transtria_get_codes_by_names( $pops_keys_only );
	
	//get the selected values (results) for this study from code_results (then translate to human language from code_tbl!)
	$results = cc_transtria_get_all_code_results_by_study_id( $study_id );
	
	return $results;



}

/**
 * Gets all EA tab data given a study id
 *
 * @param int, int. Study ID, number of ea tabs (from meta table if not provided)
 * @return array. String list of EA tab names
 */
function cc_transtria_get_ea_tab_data_for_study( $study_id, $num_ea_tabs = null ){

	global $wpdb;
	
	if( is_null( $num_ea_tabs ) ){
	
		//how many ea tabs do we have?
		$meta_sql = $wpdb->prepare( 
			"
			SELECT      value
			FROM        $wpdb->transtria_metadata
			WHERE		StudyID = %s 
			AND 		variablename = 'ea tabCount'
			",
			$study_id
		); 
		
		$ea_tab_count = $wpdb->get_results( $meta_sql, ARRAY_A );
		
		$num_ea_tabs = intval( $ea_tab_count[0]['value'] ); 
	
	} 
	
	$which_ea_tabs;
	
	//how many ea tabs do we have?
	$ea_sql = $wpdb->prepare( 
		"
		SELECT      *
		FROM        $wpdb->transtria_effect_association
		WHERE		StudyID = %d 
		AND 		seq <= %d
		",
		$study_id,
		$num_ea_tabs
	); 
	
	$form_rows = $wpdb->get_results( $ea_sql, ARRAY_A );
	
	$all_ea_tabs = array(); //instantiate empty array to hold all the pops data
	
	//cycle through all ea #s and do some stuff (Mel's brain is tired right now)
	for( $i = 1; $i <= $num_ea_tabs; $i++ ){
		//put label of form rows in div id form
		$label = 'ea_' . $i;
		$new_form_rows = cc_transtria_match_div_ids_to_ea_columns_single( $label, $form_rows[$i - 1], false ); //0-indexed form_rows..
	
		//add to master array
		$all_ea_tabs[ $i ] = $new_form_rows;
		
	}
	
	//var_dump( $all_ea_tabs );
	
	return $all_ea_tabs;

}



/**
 * Returns array of ints of study ids already in studies table
 *
 * @since    1.0.0
 * @return 	array
 */
function cc_transtria_get_study_ids( ){
	global $wpdb;
	
	//TODO, use wp->prepare
	$question_sql = 
		"
		SELECT StudyID 
		FROM $wpdb->transtria_studies
		order by StudyID
		";
		
	$form_rows = $wpdb->get_results( $question_sql, ARRAY_N );
	
	//TODO: can we just use get_results instead of this mess?  Probably..
	//declare our array to hold study vals
	$study_array = array();
	
	//cycle through the array and get the int values of study id
	foreach ( $form_rows as $row ){ //intval("string")

		array_push( $study_array, intval( $row[0] ) ); //we could do string here if need be...
		
	}
	
	return $study_array;

}

/**
 * Returns array of ints of endnote ids from rec-number in phase2 table
 *
 * @since    1.0.0
 * @return 	array
 */
function cc_transtria_get_endnote_id_title( ){
	global $wpdb;
	
	$question_sql = 
		"
		SELECT `rec-number`, `titles_title`
		FROM $wpdb->transtria_phase2
		order by `titles_title`
		";
		
	$form_rows = $wpdb->get_results( $question_sql, ARRAY_A );
	
	//TODO: can we just use get_results instead of this mess?  Probably..
	//declare our array to hold study vals
	$endnote_array;
	
	//cycle through the array and get the int values of study id
	foreach ( $form_rows as $row ){ //intval("string")
	
		if( $row["rec-number"] !== NULL ){ //some of these are NULL in the transfer until Mel does it right.
			$endnote_array[ intval( $row["rec-number"] ) ] = $row["titles_title"]; //we could do string here if need be...
		}
		
	}
	
	return $endnote_array;

}

/**
 * Returns citation info for a given endnote id
 *
 * @param int. Endnote ID
 * @return array.
 */
function cc_transtria_get_endnote_citation_info( $endnoteid ){

	global $wpdb;
	
	$endnote_sql = $wpdb->prepare( 
		"
		SELECT      *
		FROM        $wpdb->transtria_phase2
		WHERE		`rec-number` = %d 
		",
		intval($endnoteid)
	); 
		
	$form_rows = $wpdb->get_row( $endnote_sql, OBJECT );
	
	//TODO: can we just use get_results instead of this mess?  Probably..
	//declare our array to hold study vals
	//$endnote_array;

	
	return $form_rows;

}

/**
 * Returns assignment data for all studies in system
 *
 * @return array
 */
function cc_transtria_get_assignments_info(){

	global $wpdb;
	//Get all Studies w/ EndNote and Phase info from Studies 1 w SG data
	$studies_query_has_sg =
		"SELECT
		StudyID, abstraction_complete, validation_complete, EndNoteID, StudyGroupingID, $wpdb->transtria_studygroupings.readyAnalysis
			from $wpdb->transtria_studies
			INNER JOIN $wpdb->transtria_studygroupings
			ON $wpdb->transtria_studies.StudyGroupingID = $wpdb->transtria_studygroupings.EPNP_ID
			WHERE $wpdb->transtria_studies.StudyGroupingID IS NOT NULL
			AND $wpdb->transtria_studies.EndNoteID IS NOT NULL
			ORDER BY StudyID";
		
	// Get all Studies w/ EndNote and Phase info from Studies 1 w/o SG data
	$studies_query_no_sg =
		"SELECT StudyID, abstraction_complete, validation_complete, EndNoteID
			from $wpdb->transtria_studies
			WHERE StudyGroupingID IS NULL
			AND EndNoteID IS NOT NULL
			ORDER BY StudyID";  

	// Get all Studies w/o EndNote/Phase data w SG data
	$studies_query_no_endnote_has_sg =
		"SELECT StudyID, abstraction_complete, validation_complete, StudyGroupingID, $wpdb->transtria_studygroupings.readyAnalysis
			from $wpdb->transtria_studies
			INNER JOIN $wpdb->transtria_studygroupings
			ON $wpdb->transtria_studies.StudyGroupingID = $wpdb->transtria_studygroupings.EPNP_ID
			WHERE $wpdb->transtria_studies.StudyGroupingID IS NOT NULL
			AND $wpdb->transtria_studies.EndNoteID IS NULL
			ORDER BY StudyID";				   

	// Get all Studies w/o EndNote/Phase data w/o SG data
	$studies_query_no_endnote_no_sg = 
		"SELECT StudyID, abstraction_complete, validation_complete 
			from $wpdb->transtria_studies
			WHERE $wpdb->transtria_studies.StudyGroupingID IS NULL
			AND $wpdb->transtria_studies.EndNoteID IS NULL
			ORDER BY StudyID";

	//run queries!
	$studies_rows_has_sg = $wpdb->get_results( $studies_query_has_sg, ARRAY_A );
	$studies_rows_no_sg = $wpdb->get_results( $studies_query_no_sg, ARRAY_A );
	$studies_rows_no_endnote_has_sg = $wpdb->get_results( $studies_query_no_endnote_has_sg, ARRAY_A );
	$studies_rows_no_endnote_no_sg = $wpdb->get_results( $studies_query_no_endnote_no_sg, ARRAY_A );
	

	$all_assignment_studies = array_merge( $studies_rows_has_sg, $studies_rows_no_sg, $studies_rows_no_endnote_has_sg, $studies_rows_no_endnote_no_sg );
	return $all_assignment_studies;



}

/**
 * Returns initial endnote information for Assignments table
 *
 * @param array.
 */
function cc_transtria_get_endnote_for_assignments(){
	
	global $wpdb;

	//need to get endnote data (phase2 table) for all study groupings.  Mel is not making this work in single call, due to 'rec-number' hyphen...
	$endnotes_query =
		"SELECT t1.EndNoteID, `titles_title`, `contributors_authors_author`, `dates_pub-dates_date`, `dates_year`
			from $wpdb->transtria_phase2, $wpdb->transtria_studies t1
			WHERE `rec-number` = t1.EndNoteID
			AND t1.EndNoteID IS NOT NULL";  
	
	
	$endnote_rows = $wpdb->get_results( $endnotes_query, OBJECT_K );
	
	return( $endnote_rows );

}

/**
 * Updates studies table with new study grouping assignment
 *
 * @param array
 *
 */
function cc_transtria_update_study_groupings( $incoming ){

	global $wpdb;
	
	//log
	$error_array = array();
	
	//iterate through incoming data and assign study groupings to studies
	foreach( $incoming as $i => $v ){
			
		$data = array( 
			'StudyGroupingID' => $v 
		);
		$where = array( 'StudyID' => $i );

		$result = $wpdb->update( $wpdb->transtria_studies, $data, $where, $format = null, $where_format = null );
		
		$error_array[ $i ] = $result;

	}
	
	return $error_array;
	
}

/**
 * Updates studygroupings table with readyAnalysis info (or whatever else when the time comes
 *
 * @param array.
 * @return array. Error messages per update attempt (0 means no change OR fail)
 */
function cc_transtria_update_ready_analysis( $incoming ){

	global $wpdb;
	
	//log
	$error_array = array();
	
	//iterate through incoming data and assign study groupings to studies
	foreach( $incoming as $i => $v ){
			
		$data = array( 
			'readyAnalysis' => $v 
		);
		$where = array( 'EPNP_ID' => $i );

		$result = $wpdb->update( $wpdb->transtria_studygroupings, $data, $where, $format = null, $where_format = null );
		
		$error_array[ $i ] = $v;

	}
	
	return $error_array;

		  # Save assignment of Study Grouping to related study
      # also, Save readyanalysis to StudyGrouping db table

	  /*
    

      for i, v in data['assignment_data'].iteritems():
         print i, v
         _ready = 'Y' if v is True else 'N'
         print _ready
         if i < 1 or i is None:
            pass

         else: 
            _exists_query="""select count(1) from Transtria.dbo.StudyGroupingOrgIDs
                       where EPNP_ID = %s""" % (i)

            self._db.execute(_exists_query)

            _exists = 0
            for _count in self._db:
               _exists = _count[0]

            if _exists > 0:
               _update_query="""update Transtria.dbo.StudyGroupingOrgIDs
                                set readyAnalysis=%s
                                where EPNP_ID=%s""" % (_ready, i)    

               print self._db.execute(_update_query)

            else:
               _insert_query="""insert into Transtria.dbo.StudyGroupingOrgIDs
                                (EPNP_ID, readyAnalysis)
                                VALUES (%s, %s)""" % (i, _ready)

      #return _existing_SGIDs
      return data 

	  */







}



/**
 * Returns list of study groupings
 *
 * @return array
 */
function cc_transtria_get_study_groupings(){
	global $wpdb;
	
	$study_groupings_query =
		"SELECT
			EPNP_ID
			from $wpdb->transtria_studygroupings
			ORDER BY EPNP_ID";

	$study_groupings = $wpdb->get_results( $study_groupings_query, ARRAY_A );
	
	return $study_groupings;
}


//TODO: are we using this?
/**
 * Function to get form drop down options.  First pass takes input array as lookup and foreachs..
 *
 * @return Array. Array of arrays.
 */
function cc_transtria_get_dropdown_options( ){

	//list of dropdowns with single instance on the form (i.e., no other dropdowns of that type exist)
	$dd_options_singletons = cc_transtria_get_singleton_dropdown_options();
	
	//list of dropdowns with multiple instances (Populations tabs)
	$dd_options_multiples_pops = cc_transtria_get_multiple_dropdown_options_populations();
	
	//list of dropdowns with multiple instances (EA tabs)
	$dd_options_multiples_ea = cc_transtria_get_multiple_dropdown_options_ea();




}

/**
 * Gets an array of SINGLETON lookups to do and does those lookups
 *
 * @return Array.  Array of arrays of options for all singleton dropwdown fields (dropdowns that only exist ONCE in the form).
 *
 */
function cc_transtria_get_singleton_dropdown_options(){

	$dd_ids = cc_transtria_get_singleton_dropdown_ids();
	
	//array to hold all the options, indexed by div_id name
	$dd_options;
	
	//Now, perform lookup.
	foreach( $dd_ids as $div_id => $lookup_name ){
	
		$dd_options[ $div_id ] = cc_transtria_get_options_from_db( $lookup_name );
	
	}
	
	//var_dump( $dd_options );
	
	return $dd_options;

}

/**
 * Gets an array of MULTIPLE lookups for POPULATIONS  and does those lookups
 *
 * @return Array.  Array of arrays of options for all multiple POPULATION dropwdown fields (dropdowns that exist in Populations tabs in form).
 *
 */
function cc_transtria_get_multiple_dropdown_options_populations( $study_id = null ){

	$dd_ids = cc_transtria_get_multiple_dropdown_ids_populations( 'all', $study_id );
	
	//Now, perform lookup for all pops types
	foreach( $dd_ids as $div_id => $lookup_name ){
		
		$dd_options[ $div_id ] = cc_transtria_get_options_from_db( $lookup_name );
	
	}
	
	return $dd_options;

}


/**
 * Gets an array of SINGLETON lookups and does those lookups
 *
 * @return Array.  Array of arrays of options for all singleton dropdown fields (dropdowns that only exist ONCE in the form).
 *
 */
function cc_transtria_get_multiple_dropdown_options_ea(){

	$dd_ids = cc_transtria_get_multiple_dropdown_ids_ea();
	
	//Now, perform lookup.  Just once, since all ea tabs will have same data in their dropdowns.  #efficiency
	foreach( $dd_ids as $div_id => $lookup_name ){
		
		$dd_options[ $div_id ] = cc_transtria_get_options_from_db( $lookup_name );
	
	}
	
	return $dd_options;

}


/**
 * Function to actually get options from the 2 code tables, given a lookup name string
 *
 * @param string. Name of lookup
 * @return array. 
 */
function cc_transtria_get_options_from_db( $code_name = NULL ){

	
	if( $code_name == NULL ){ //your cover has been blown.  Go to page 38.
		
		return 0; //?
	
	}

	global $wpdb;
	
	$codetype_sql = $wpdb->prepare( 
		"
		SELECT      codetypeID
		FROM        $wpdb->transtria_codetype
		WHERE		codetype = %s 
		",
		$code_name
	); 
	
	//single codetype id returned
	$codetype_id = $wpdb->get_var( $codetype_sql ); //get_var returns single var

	//take that codetypeid and get all the options for it in the transtria_codetbl
	$codetype_sql = $wpdb->prepare( 
		"
		SELECT      value, descr
		FROM        $wpdb->transtria_codetbl
		WHERE		codetypeID = %d
		AND			inactive_flag != 'Y'
		ORDER BY	sequence
		",
		$codetype_id
	); 
	
	$codetype_array = $wpdb->get_results( $codetype_sql, OBJECT_K ); //OBJECT_K - result will be output as an associative array of row objects, using first column's values as keys (duplicates will be discarded). 
	
	return $codetype_array;

}

/**
 * Gets all population types given a study id
 *
 * @param int. Study ID
 * @return array. String list of populations types
 */
function cc_transtria_get_all_pops_type_for_study( $study_id ){

	global $wpdb;
	
	$which_pops = cc_transtria_get_basic_pops_types();
	
	if ( empty( $study_id ) ){
		return $which_pops;
	
	} else {

		//how many ese tabs do we have?
		$meta_sql = $wpdb->prepare( 
			"
			SELECT      value
			FROM        $wpdb->transtria_metadata
			WHERE		StudyID = %s 
			AND 		variablename = 'ese tabCount'
			",
			$study_id
		); 
		
		$ese_tab_count = $wpdb->get_results( $meta_sql, ARRAY_A );
		$ese_tab_count = intval( $ese_tab_count[0]['value'] ); //e.g., if = 2, look for ese0, ese1
		
		//var_dump( $ese_tab_count );
		
		//because ese tabs are zero-indexed (meaning: just one addtnl ese tab = ese0):
		for( $i=0; $i < $ese_tab_count; $i++){
			//append ese tab name to $which_pops
			$current_ese_tab = 'ese' . $i;
			//push to allpops array?
			array_push( $which_pops, $current_ese_tab );
		}

		return $which_pops;

	}

}

/**
 * Gets all EA tabs given a study id
 *
 * @param int. Study ID
 * @return array. String list of EA tab names
 */
function cc_transtria_get_num_ea_tabs_for_study( $study_id ){

	if( empty( $study_id ) ) {
		return 0;
	}
	
	global $wpdb;
	
	$which_ea_tabs;
	
	//how many ea tabs do we have?
	$meta_sql = $wpdb->prepare( 
		"
		SELECT      value
		FROM        $wpdb->transtria_metadata
		WHERE		StudyID = %s 
		AND 		variablename = 'ea tabCount'
		",
		$study_id
	); 
	
	$ea_tab_count = $wpdb->get_results( $meta_sql, ARRAY_A );
	$ea_tab_count = intval( $ea_tab_count[0]['value'] ); 

	return $ea_tab_count;

}


/**
 * Gets num other indicators given a study id
 *
 * @param int. Study ID
 * @return array. String list of EA tab names
 */
function cc_transtria_get_num_other_ind_for_study( $study_id ){

	if( empty( $study_id ) ) {
		return 0;
	}
	
	global $wpdb;
	
	$which_ea_tabs;
	
	//how many ea tabs do we have?
	$meta_sql = $wpdb->prepare( 
		"
		SELECT      value
		FROM        $wpdb->transtria_metadata
		WHERE		StudyID = %d
		AND 		variablename = 'indicatorNum'
		",
		$study_id
	); 
	
	$ind_count = $wpdb->get_results( $meta_sql, ARRAY_A );
	$ind_count = intval( $ind_count[0]['value'] ); 

	return $ind_count;

}

/**
 * Gets num other outcomes given a study id
 *
 * @param int. Study ID
 * @return int. Number of rows updated
 */
function cc_transtria_get_num_other_out_for_study( $study_id ){

	if( empty( $study_id ) ) {
		return 0;
	}
	
	global $wpdb;
	
	$which_ea_tabs;
	
	//how many ea tabs do we have?
	$meta_sql = $wpdb->prepare( 
		"
		SELECT      value
		FROM        $wpdb->transtria_metadata
		WHERE		StudyID = %d
		AND 		variablename = 'outcomeNum'
		",
		$study_id
	); 
	
	$out_count = $wpdb->get_results( $meta_sql, ARRAY_A );
	$out_count = intval( $out_count[0]['value'] ); 

	return $out_count;

}


/**
 * Returns codetypeID of lookups, given array of string names
 *
 * @param array?
 * @return Array?
*/

function cc_transtria_get_codes_by_names( $incoming_names ){

	global $wpdb;
	
	//turn array into comma-delimited string
	
	$incoming_string_list = implode("','", $incoming_names );
	
	//remove " from beginning and end and replace w '
	//$incoming_string_list = substr( $incoming_string_list, 0, -1 );
	$incoming_string_list = "'" . $incoming_string_list . "'";
	trim($incoming_string_list, '\"'); 
	
	//can we do this in one db call (instead of one db call per name)?
	$codeid_sql = 
			"
			SELECT      codetype, codetypeID
			FROM        $wpdb->transtria_codetype
			WHERE		codetype IN ( $incoming_string_list )
			"
	;
	
	$code_ids = $wpdb->get_results( $codeid_sql, ARRAY_A );
	
	return $code_ids;

}

/**
 * Get all code_results values (2-char string) given a study id
 *
 * @param int. Study ID
 * @return array
 *
 */
function cc_transtria_get_all_code_results_by_study_id( $study_id = null ){

	global $wpdb;
	
	//ok, this works, but can we join w/codetype table to get names?
	/*$results_sql = $wpdb->prepare( 
		"
		SELECT      t1.codetypeID, t1.result
		FROM        $wpdb->transtria_code_results t1
		WHERE		ID = %s 
		",
		$study_id
	); */
	
	$results_sql = $wpdb->prepare(
		"
		SELECT t2.codetype, t1.result 
		FROM $wpdb->transtria_code_results t1,
			$wpdb->transtria_codetype t2
		WHERE t1.codetypeID = t2.codetypeID
		AND t1.ID = %s
		order by t2.codetype
		",
		$study_id
	);
	
	$results = $wpdb->get_results( $results_sql, ARRAY_A );
	
	//now, we need to put these in a coherent format. All items with the same codetypeid should be in their own sub-array. 
	$out = array();
	
	foreach ( $results as $result ) {
		
		//result['codetypeid'] will be the key 
		//$key = $result['codetypeID'];
		$key = $result['codetype'];
		$r = & $out;
		
		//foreach ( explode( ".", $key ) as $key ) {
		foreach ( explode( ",", $key ) as $key ) {
			//var_dump( $key );
			if ( isset( $r[$key] ) ) {
				//test for array already
				if( is_array( $r[$key] ) ){
					//push the new value
					array_push( $r[$key], $result['result'] );
				} else {
					//make an array w the new value added
					$old_r_key = $r[$key];
					$r[$key] = array( $old_r_key, $result['result'] );
				}
				
			} else {
				//there is no key existing, make new one
				$r[$key] = $result['result']; 
			}
			$r = & $r[$key];
		}
				
	}
	
	//order the array by codetype id key (for sanity and checking things)
	ksort( $out );
	
	//var_dump( $out ); //works!
	return $out;
	
}






/**
 * Gets the last study id in table and increments it by one.
 *
 * @since   1.0.0
 * @return 	array
 */
function cc_transtria_get_next_study_id( ){
	global $wpdb;
	 
	$results = $wpdb->get_col( 
		"
		SELECT max( StudyID )
		FROM $wpdb->transtria_studies
		"
	);
	
	$int_results = (int)$results[0] + 1;//todo: is this the best way?
	
	return $int_results;

}

//TODO: code table things.....