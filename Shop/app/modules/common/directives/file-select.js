function fileSelectDirective() {
    return {
        require: "ngModel",
        scope: {
            image: "=ngModel"
        },
        template: `
            <div class="image-placeholder" ng-hide="image"></div>
            <img ng-show="image" ng-src="{{ image }}" />
            <input type="file" id="file" class="inputfile">
            <div class="controls">
                <label ng-hide="image" for="file" class="btn">Pick Image</label>
                <label ng-show="image" for="file" class= "btn">Pick new</label>
                <button ng-show="image" type="button" class= "btn" ng-click="remove()">Remove</button>
            </div>`,
        link: link
    };

    function link(scope, element, attrs, ngModel) {
        element.find('input').bind("change", (event) => {
            const file = (event.srcElement || event.target).files[0];
            const reader = new FileReader();

            reader.onload = () => scope.$apply(() => scope.image = reader.result);
            reader.readAsDataURL(file);
        });

        scope.remove = function () {
            scope.image = null;
            element.find('input').val('');
        }
    }

}

export default fileSelectDirective;