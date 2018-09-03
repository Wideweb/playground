function toggleDirective($document) {
    return {
        restrict: 'A',
        scope: {
            toggle: '@',
            toggleClass: '@',
        },
        link: (scope, element) => {
            const target = angular.element(document.querySelector(`#${scope.toggle}`));
            const toggleClass = scope.toggleClass || 'open';

            const handler = (event) => {
                if (element[0].contains(event.target)) {
                    target.toggleClass(toggleClass);
                    element.toggleClass(toggleClass);
                } else {
                    target.removeClass(toggleClass);
                    element.removeClass(toggleClass);
                }
            };

            $document.on('click', handler);
            scope.$on('$destroy', () => $document.off('click', handler));
        },
    };
}

toggleDirective.$inject = ['$document'];

export default toggleDirective;
