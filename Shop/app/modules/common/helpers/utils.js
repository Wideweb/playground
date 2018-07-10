const TEMPLATE_FILLER_OPTIONS = {
    start: '{',
    end: '}'
};

export function fillTemplate(
    /* String */ template = '',
    /* Object */ parameters = {},
    /* Object */ options = {}, // if requires to override defaults
    /* Function */ parameterMap = angular.identity // prepare parameter before using
) {
    let result = template;
    let settings = Object.assign({}, TEMPLATE_FILLER_OPTIONS, options);

    if ((typeof result === 'string') && result.length) {
        for (let prop in parameters) {
            if (parameters.hasOwnProperty(prop)) {
                let parameter = parameters[prop];
                let encodedParameter = Array.isArray(parameter)
                    ? parameter.map(x => parameterMap(x)).join(',')
                    : parameterMap(parameter);

                result = result.replace(new RegExp(`${settings.start}${prop}${settings.end}`, 'g'), encodedParameter);
            }
        }
    }
    return result;
}