<?php

namespace bootstrap\modal_manager{
    
    /* Prevent Direct Access */
    defined('ADAPT_STARTED') or die;
    
    class bundle_bootstrap_modal_manager extends \adapt\bundle{
        
        public function __construct($data){
            parent::__construct('bootstrap_modal_manager', $data);
        }
        
        public function boot(){
            if (parent::boot()){
                
                $this->dom->head->add(new html_script(array('type' => 'text/javascript', 'src' => "/adapt/bootstrap_modal_manager/bootstrap_modal_manager-{$this->version}/static/js/modal_manager.js")));
                return true;
            }
            
            return false;
        }
        
    }
    
    
}

?>