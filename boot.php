<?php

/*
 * Prevent direct access
 */
defined('ADAPT_STARTED') or die;
use \frameworks\adapt as adapt;

$adapt = $GLOBALS['adapt'];

$adapt->dom->head->add(new adapt\html_script(array('type' => 'text/javascript', 'src' => '/adapt/extensions/bootstrap_modal_manager/static/js/modal_manager.js')));

?>