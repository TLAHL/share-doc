$(document)
    .ready(
        function() {
            var doc = document,
                inputs = doc
                .getElementsByTagName('input'),
                supportPlaceholder = 'placeholder' in doc
                .createElement('input'),
                placeholder = function(
                    input) {
                    var text = input.getAttribute('placeholder'),
                        defaultValue = input.defaultValue;
                    if (defaultValue == '') {
                        input.value = text
                        input.setAttribute("old_color", input.style.color);
                        input.style.color = "#c0c0c0";
                    }
                    input.onfocus = function() {
                        this.style.color = this.getAttribute("old_color");
                        if (input.value === text) {
                            this.value = ''
                        }
                    };
                    input.onblur = function() {
                        if (input.value === '') {
                            this.style.color = "#c0c0c0";
                            this.value = text
                        }
                    }
                };
            if (!supportPlaceholder) {
                for (var i = 0, len = inputs.length; i < len; i++) {
                    var input = inputs[i],
                        text = input
                        .getAttribute('placeholder');
                    if (input.type === 'text' && text) {
                        placeholder(input)
                    }
                }
            }
        });