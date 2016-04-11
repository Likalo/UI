angular.module('com.likalo.ui')
    .directive('uiToggle', function uiToggle() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function switchController($scope, $el, $attrs, ngModel) {
             var active = $attrs['uiToggle'] || 'active',
            ngModel = ngModel || new ngModelNoop();

                ngModel.$render = function() {
                    if(angular.isDefined(ngModel.$modelValue))
                    $el.toggleClass(active, ngModel.$modelValue === true);
                };

                $el.on('click', function(e) {
                    if ($attrs.disabled) return;
                    var isActive = $el.hasClass(active);
                    $scope.$apply(function() {
                        ngModel.$setViewValue(!isActive);
                        ngModel.$render();
                    });
                    e.preventDefault();
                    e.stopPropagation();
                });

                $el.addClass("UI-toggle");
                if ($el.hasClass(active)) ngModel.$setViewValue(true);

            }
        };
    })
    .directive('uiToggleLink', ['$timeout', '$document', function uiToggleLink($timeout, $document) {
        var document = $document[0];
        return {
            restrict: 'A',
            link: function($scope, $el, $attrs) {
                var active = $attrs['uiToggle'] || 'active',
                    target = angular.element(document.getElementById($attrs.uiToggleLink));
                if(angular.isObject(target)) {
                    target.addClass('UI-toggle--linked');
                    $timeout(function(){
                        target.toggleClass(active, $el.hasClass(active));
                    },1);
                    $scope.$watch(function isActive() {return $el.hasClass(active); }, function(isActive){
                        target.toggleClass(active, isActive);
                    });
                }
            }
        };
    }])
    .directive('uiToggleClearonout', ['$document', function uiToggleLink($document) {
        return {
            restrict: 'A',
            link: function($scope, $el, $attrs) {
            function listener(e){
                var active = $attrs['uiToggle'] || $attrs['uiToggleClearonout'] || 'active',
                    isActive = $el.hasClass(active);
                if (isActive && !angular.equals(e.target, $el[0])) {
                $el.removeClass(active);
                $document.off('click', listener);
                }
            }
            $scope.$watch(function isActive() {return $el.hasClass(active); }, function(isActive){
                if(isActive) $document.on('click', listener);
            });
            $scope.$on("$destroy",
                function handleDestroyEvent() {
                    $document.off('click', listener);
                }
            );
            }
        };
    }])
    .directive('uiAttachLabel', function uiToggleHasLabel() {
        return {
            restrict: 'A',
            link: function($scope, $el, $attrs) {
                    $attrs.$observe('disabled', function(value) {
                        $el.parent().toggleClass("disabled", value);
                    });
                    $el.parent()
                        .addClass("UI-toggle--label")
                        .on('click', function(e){
                            //Pass click event from the connected element
                            angular.element($el).triggerHandler('click');
                        });
                    if($attrs.disabled) $el.parent().addClass("disabled");
                }
            };
    })
    .directive('uiCheckbox', function uiCheckbox() {
        return {
            restrict: 'E',
            replace: true,
            template: '<svg class="UI-checkbox" viewBox="0 0 24 24" ui-toggle><rect class="UI-toggle--base" x="2" y="2" width="20" height="20" rx="2" ry="2" /><rect class="UI-toggle--knob" x="8" y="8" width="8" height="8" rx="1" ry="1" /></svg>'
        };
    })
    .directive('uiRadio', function uiRadio() {
        return {
            restrict: 'EA',
            template: '<svg class="UI-toggle UI-radio" viewBox="0 0 24 24" uiToggleHasLabel><circle class="UI-toggle--base" cx="12" cy="12" r="10"/><circle class="UI-toggle--knob" cx="12" cy="12" r="5"/></svg>',
            replace: true
        };
    })
    .directive('uiSwitch', function uiSwitch() {
        return {
            restrict: 'E',
            replace: true,
            template: '<svg class="UI-switch" viewBox="0 0 36 24" ui-toggle><rect class="UI-toggle--base" x="2" y="3" width="32" height="18" rx="8" ry="8" /><circle class="UI-toggle--knob" x="2" cx="12" cy="12" r="6"/></svg>'
        };
    });