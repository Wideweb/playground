function equalToDirective() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=equalTo"
        },
        link: link
    };

    function link(scope, element, attrs, ngModel) {
        ngModel.$validators.equalTo = function (modelValue) {
            return isValid(modelValue, scope.otherModelValue);
        };

        scope.$watch("otherModelValue", function (otherModelValue) {
            ngModel.$setValidity('equalTo', isValid(ngModel.$modelValue, otherModelValue));
        });
    }

    function isValid(modelValue, otherModelValue) {
        return modelValue == otherModelValue;
    }

}

export default equalToDirective;