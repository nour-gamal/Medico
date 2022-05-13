const getSelectedProperties = (originalObject, removedParameters, addedParameters) => {
    const targetObject = originalObject.toObject()

    //Remove data from object
    if (removedParameters) {
        removedParameters.map(params => {
            delete targetObject[params]
        })
    }
    if (addedParameters) {
        //Added data from object
        addedParameters.forEach(params => {
            targetObject[params.key] = params.value
        })
    }
    return targetObject;
}

module.exports = { getSelectedProperties }