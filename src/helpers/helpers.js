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
        for (let index = 0; index < Object.keys(addedParameters).length; index++) {
            targetObject[Object.keys(addedParameters)[index]] = Object.values(addedParameters)[index]
        }

    }
    return targetObject;
}

module.exports = { getSelectedProperties }