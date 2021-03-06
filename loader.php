<?php
/*
Plugin Name: CC Transtria Extras
Description: Builds the monstrous Transtria Form
Version: 1.0
*/
/**
 * CC Transtria
 *
 * @package   CC Transtria Extras
 * @author    CARES staff
 * @license   GPL-2.0+
 * @copyright 2015 CommmunityCommons.org
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/*----------------------------------------------------------------------------*
 * Public-Facing Functionality
 *----------------------------------------------------------------------------*/

function cc_transtria_class_init(){
	// Get the class fired up
	// Helper and utility functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-functions.php' );
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-analysis-functions.php' );
	require_once( dirname( __FILE__ ) . '/includes/array_column.php' ); //to mimic php 5.5+ array column function //TODO: test w actual servers, since dev environ is 5.5.+
	
	// Template-y functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-template-tags.php' );

	// Database helper functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-database-bridge.php' );
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-analysis-database-bridge.php' );
	
	// Study Form template functions, pops tab, intervention_partnerships, results
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-study-form-template-tags.php' );	
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-populations-template-tags.php' );	
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-intervention-partnerships-template-tags.php' );	
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-results-template-tags.php' );		
	
	// Assignments template functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-assignments-template-tags.php' );	
	// STudy Grouping template functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-studygrouping-template-tags.php' );	
	// Analysis template functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-analysis-template-tags.php' );	
	// Download template functions
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-download-template-tags.php' );	
	
	// The main class
	require_once( dirname( __FILE__ ) . '/includes/cc-transtria-extras.php' );
	add_action( 'bp_include', array( 'CC_Transtria_Extras', 'get_instance' ), 21 );  //TODO
	
	
	//Mel...is this overkill
	global $wpdb;
	
	//Read only tables 
    $wpdb->transtria_codetype = $wpdb->prefix . 'transtria_codetype';
    $wpdb->transtria_codetbl = $wpdb->prefix . 'transtria_codetbl';
    $wpdb->transtria_phase2 = $wpdb->prefix . 'transtria_phase2';
	
	//write-to tables
    $wpdb->transtria_metadata = $wpdb->prefix . 'transtria_metadata';
    $wpdb->transtria_studies = $wpdb->prefix . 'transtria_studies';
    $wpdb->transtria_population = $wpdb->prefix . 'transtria_population';
    $wpdb->transtria_effect_association = $wpdb->prefix . 'transtria_effect_association';
    $wpdb->transtria_code_results = $wpdb->prefix . 'transtria_code_results';
    $wpdb->transtria_studygroupings = $wpdb->prefix . 'transtria_studygroupings';
	
	//write-to analysis tables
	$wpdb->transtria_analysis_intermediate = $wpdb->prefix . 'transtria_analysis_intermediate';
	$wpdb->transtria_analysis = $wpdb->prefix . 'transtria_analysis';
	$wpdb->transtria_analysis_studygrouping = $wpdb->prefix . 'transtria_analysis_studygrouping';  //write-to sg table
	
}
add_action( 'bp_include', 'cc_transtria_class_init' );

/* Only load the component if BuddyPress is loaded and initialized. */
function startup_transtria_extras_group_extension_class() {
	require( dirname( __FILE__ ) . '/includes/class-bp-group-extension.php' );
}
add_action( 'bp_include', 'startup_transtria_extras_group_extension_class', 24 );