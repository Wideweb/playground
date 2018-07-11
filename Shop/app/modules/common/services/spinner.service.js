﻿const Controller = {
    counter: 0
};

/**********************************************************************************************
 * Spinner Provider
 **********************************************************************************************/
export default class {

    /******************************************************************************************
     COMPUTED & REFERENCES
     ******************************************************************************************
     is spinner displayed
     ******************************************************************************************/
    get isActive() {
        return Controller.counter > 0;
    }

    /******************************************************************************************
     PUBLIC METHODS
     ******************************************************************************************
     show spinner
     ******************************************************************************************/
    show() {
        Controller.counter++;
    }

    /******************************************************************************************
     hide spinner
     ******************************************************************************************/
    hide() {
        Controller.counter > 0 ? Controller.counter-- : 0;
    }

    /******************************************************************************************
     * Clean up service data
     ******************************************************************************************/
    clear() {
        Controller.counter = 0;
    }

}