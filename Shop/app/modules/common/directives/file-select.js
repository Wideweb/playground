function fileSelectDirective() {
    return {
        require: "ngModel",
        scope: {},
        template: `
            <div ng-hide="image"></div>
            <img ng-src="{{ image }}" />
            <input type="file" name="file" id="file" class="inputfile">
            <label for="file" class="btn">Choose a file</label>`,
        link: link
    };

    function link(scope, element, attrs, ngModel) {
        element.find('input').bind("change", (event) => {
            const file = (event.srcElement || event.target).files[0];
            const reader = new FileReader();

            reader.onload = () => scope.$apply(() => scope.image = reader.result);
            reader.readAsDataURL(file);

            ngModel.$modelValue = file;
        });
    }

}

export default fileSelectDirective;