! function() {
    "use strict";

    function e() { return { restrict: "E", template: '<button class="btn">{{back}}</button>', scope: { back: "@back", forward: "@forward", icons: "@icons" }, link: function(e, n, t) { $(n[0]).on("click", function() { history.back(), e.$apply() }), $(n[1]).on("click", function() { history.forward(), e.$apply() }) } } }

    function n(e) { return { restrict: "AC", link: function(n, t) { e(function() { t[0].focus() }, 0) } } }

    function t(e) { return { restrict: "A", require: "ngModel", link: function(n, t, i, a) { t.bind("blur", function(n) { a.$loading = !0, e.post("/patient/patient_verification_email/", { email: t.val() }).success(function(e) { a.$loading = !1, a.$setValidity("unique", !e) }) }) } } }

    function i(e) {
        return {
            require: "ngModel",
            link: function(n, t, i, a) {
                var r = i.date || "yyyy-MM-dd";
                a.$formatters.unshift(function(n) { return e(n, r) })
            }
        }
    }

    function a() { return function(e, n, t) { n.bind("keydown keypress", function(n) { 13 === n.which && (e.$apply(function() { e.$eval(t.appEnter) }), n.preventDefault()) }) } }

    function r(e) { return { restrict: "A", require: "ngModel", link: function(e, n, t, i) { n.bind("click", function(e) { i.$loading = !0 }) } } }

    function o() {
        return {
            replace: !1,
            restrict: "A",
            scope: "?ngModel",
            link: function(e, n, t) {
                var i = angular.element(n);
                if (t.ngModel) {
                    var a = t.ngModel.split(".");
                    a[0] && e.$watch(a[0], function(e) {
                        var n = parseFloat(i.val());
                        if (isNaN(n)) i.val();
                        else if ("number" == typeof n) {
                            var a = "number" == typeof parseInt(t.toPrecision) ? parseInt(t.toPrecision) : 2;
                            i.val(n.toFixed(a))
                        }
                    })
                }
                i.on("blur", function() {
                    var e = parseFloat(i.val());
                    if (isNaN(e)) i.val();
                    else if ("number" == typeof e) {
                        var n = "number" == typeof parseInt(t.toPrecision) ? parseInt(t.toPrecision) : 2;
                        i.val(e.toFixed(n))
                    }
                })
            }
        }
    }

    function l() {
        return {
            restrict: "A",
            replace: !0,
            transclude: !0,
            scope: !1,
            template: '<div class="input-prepend extended-date-picker"><input type="button" class="btn-continue btn btn-custom btn-lg " value="Browse"><input type="text" readonly class="form-control"><div class="proxied-field-wrap" ng-transclude></div></div>',
            link: function(e, n, t, i) {
                var a, r, o;
                r = n.find('[type="file"]').on("change", function() { o.val(angular.element(this).val()) }), o = n.find('[type="text"]').on("click", function() { r.trigger("click") }), a = n.find('[type="button"]').on("click", function() { r.trigger("click") })
            }
        }
    }

    function c() {
        return {
            restrict: "A",
            replace: !1,
            transclude: !0,
            scope: !1,
            template: '<span ng-transclude></span><span class="btn-spinner1"></span>',
            link: function(e, n, t) {
                n.on("click", function(e) {
                    n.prop("disabled", "disabled");
                    var t = n.find(".btn-spinner1");
                    t.addClass("btn-spinner"), t.css({ opacity: 1, marginLeft: "5px" })
                })
            }
        }
    }

    function s() { return { link: function(e, n, t) { window.onbeforeunload = function() { return e.patientFrm.$dirty ? "The form is dirty, do you want to stay on the page?" : void 0 }, e.$on("$locationChangeStart", function(n, t, i) { e.patientFrm.$dirty && (confirm("The form is dirty, do you want to stay on the page?") || n.preventDefault()) }) } } }

    function u(e) { return { restrict: "A", link: function(n, t, i, a) { t.bind("click", function(e) { e.stopPropagation() }), e.bind("click", function() { n.$evalAsync(i.clickAnywhereButHere) }) } } }

    function d(e, n) { return { restrict: "E", template: '<div id="processing" ><div class="processing-loader"><img src="/assets/images/plaoder.svg"></div></div>', link: function(t, i, a) { t.isLoading = function() { return e.pendingRequests.length > 0 && "POST" == e.pendingRequests[0].method }, t.$watch(t.isLoading, function(e) { n(function() { e ? i.removeClass("ng-hide") : i.addClass("ng-hide") }) }) } } }

    function f(e) { return { restrict: "E", template: '<div id="processing" ><div class="processing-loader"><img src="/assets/images/plaoder.svg"></div></div>', link: function(n, t, i) { n.$watch(i.value, function(n) { e(function() { n ? t.hide() : t.show() }) }) } } }

    function g() { return { link: function(e, n, t) { n.bind("click", function() { n.parents(".tabs_info").toggleClass("active"), n.parents(".tabs_info").next(".tabs_descp").stop(!0, !0).slideToggle("fast") }) } } }

    function p() {
        return {
            link: function(e, n, t) {
                n.next(".collapsed-box.open").stop(!0, !0).slideDown("fast"), n.bind("click", function(e) {
                    var t = n.find("i");
                    t.hasClass("fa-chevron-down") ? t.removeClass("fa-chevron-down").addClass("fa-chevron-right") : t.removeClass("fa-chevron-right").addClass("fa-chevron-down"), n.next(".collapsed-box").stop(!0, !0).slideToggle("fast"), n.parents("v-tab").siblings().each(function(e) { angular.element(this).find(".collapsed-box").stop(!0, !0).slideUp("fast"), angular.element(this).find("i.fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-right") })
                })
            }
        }
    }

    function v() {
        return {
            restrict: "A",
            link: function(e, n, t) {
                var i = n.find("div.list-group-div");
                n.bind("click", function() {
                    var e = n.find("div.list-group-div");
                    e.stop(!0, !0).slideToggle("fast"), e.click(function(e) { e.stopPropagation() })
                });
                var a = 0;
                n.bind("keydown", function(e) {
                    e.preventDefault();
                    var t = n.find("div.list-group-div");
                    switch (e.which) {
                        case 40:
                            a = a === t.length ? 0 : a, t.removeClass("active"), t.eq(a).addClass("active"), a++;
                            break;
                        case 38:
                            a = 0 === a ? t.length - 1 : a - 1, t.removeClass("active"), t.eq(a).addClass("active");
                            break;
                        case 13:
                    }
                }), i.bind("click", function() { i.removeClass("active") })
            }
        }
    }

    function m(e) {
        return {
            link: function(n, t, i) {
                function a() {
                    var n = e.hasPermission(r, i.hasPermissionAro);
                    n ? o && "a" === o ? t.removeClass("disabled") : o && "button" === o && (t.removeClass("disabled"), t.prop("disabled", !1)) : o && "a" === o ? t.addClass("disabled") : o && "button" === o ? (t.addClass("disabled"), t.prop("disabled", !0)) : t.hide()
                }
                if (!_.isString(i.hasPermission)) throw "hasPermission value must be a string";
                var r = i.hasPermission.trim(),
                    o = angular.lowercase(t[0].tagName);
                a(), n.$on("permissionsChanged", a)
            }
        }
    }

    function h(e) { return { require: "ngModel", scope: { otherModelValue: "=compareTo" }, link: function(n, t, i, a) { a.$validators.compareTo = function(e) { return e == n.otherModelValue }, n.$watch("otherModelValue", function() { e(function() { a.$validate() }) }) } } }

    function k() {
        return function(e, n, t) {
            var i = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
            n.bind("keydown", function(n) {-1 == $.inArray(n.which, i) && (e.$apply(function() { e.$eval(t.onlyNum), n.preventDefault() }), n.preventDefault()) })
        }
    }

    function b(e) { return { require: "ngModel", scope: { passwordVerify: "=" }, link: function(n, t, i, a) { n.$watch(function() { return e(function() { var e; return (n.passwordVerify || a.$viewValue) && (e = n.passwordVerify + "_" + a.$viewValue), e }) }, function(e) { e && a.$parsers.unshift(function(e) { var t = n.passwordVerify; return t !== e ? void a.$setValidity("passwordVerify", !1) : (a.$setValidity("passwordVerify", !0), e) }) }) } } }

    function y(e) { return { restrict: "A", link: function(n, t, i) { n.$middle === !0 && e(function() { n.$emit(i.onFinishRender) }) } } }

    function M() {
        return {
            restrict: "A",
            link: function(e, n, t) {
                var i = '<div class="processing-img"><div class="processing-loader"><div class="spinner medium blue"></div> Loading....</div></div>';
                n.parents(t.imageonload).append(i), n.bind("load", function() { n.parents(t.imageonload).find(".processing-img").remove() }), n.bind("error", function(e) {})
            }
        }
    }

    function w(e) {
        return {
            restrict: "E",
            replace: !1,
            link: function(n, t, i) {
                e(function() {
                    var e = t.parents("li.tag-item"),
                        n = e.parent("ul.tag-list");
                    n.find("li").each(function(e) { 0 === e ? angular.element(this).trigger("click") : angular.element(this).addClass("disabled") }), e.bind("click", function(e) { e.preventDefault(), n.find("li").each(function(e) { angular.element(this).addClass("disabled") }), angular.element(this).toggleClass("disabled") })
                })
            }
        }
    }

    function C(e) {
        return {
            restrict: "E",
            replace: !1,
            link: function(n, t, i) {
                e(function() {
                    var e = t.parents("li.tag-item"),
                        n = e.parent("ul.tag-list");
                    n.find("li").each(function(e) { 0 === e && angular.element(this).addClass("highlight") }), e.bind("click", function(e) { e.preventDefault(), n.find("li").each(function(e) {}), angular.element(this).toggleClass("highlight") })
                })
            }
        }
    }

    function T(e) { return { restrict: "E", template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>", link: function(n, t, i) { n.isRouteLoading = !1, e.$on("$routeChangeStart", function() { n.isRouteLoading = !0 }), e.$on("$routeChangeSuccess", function() { n.isRouteLoading = !1 }) } } }

    function S(e, n) {
        function t(e, n, t) {
            if (angular.isArray(e))
                for (var i = e.length; i--;)
                    if (t(e[i], n)) return !0;
            return !1
        }

        function i(e, n, i) { return e = angular.isArray(e) ? e : [], t(e, n, i) || e.push(n), e }

        function a(e, n, t) {
            if (angular.isArray(e))
                for (var i = e.length; i--;)
                    if (t(e[i], n)) { e.splice(i, 1); break }
            return e
        }

        function r(r, o, l) {
            function c(e, n) {
                var t = d(r.$parent);
                angular.isFunction(f) && (n === !0 ? f(r.$parent, i(t, e, m)) : f(r.$parent, a(t, e, m)))
            }

            function s(e, n) { return p && p(r) === !1 ? void c(v, r[l.ngModel]) : void(r[l.ngModel] = t(e, v, m)) }
            var u = l.checklistModel;
            l.$set("checklistModel", null), n(o)(r), l.$set("checklistModel", u);
            var d = e(u),
                f = d.assign,
                g = e(l.checklistChange),
                p = e(l.checklistBeforeChange),
                v = l.checklistValue ? e(l.checklistValue)(r.$parent) : l.value,
                m = angular.equals;
            if (l.hasOwnProperty("checklistComparator"))
                if ("." == l.checklistComparator[0]) {
                    var h = l.checklistComparator.substring(1);
                    m = function(e, n) { return e[h] === n[h] }
                } else m = e(l.checklistComparator)(r.$parent);
            r.$watch(l.ngModel, function(e, n) {
                if (e !== n) {
                    if (p && p(r) === !1) return void(r[l.ngModel] = t(d(r.$parent), v, m));
                    c(v, e), g && g(r)
                }
            }), angular.isFunction(r.$parent.$watchCollection) ? r.$parent.$watchCollection(u, s) : r.$parent.$watch(u, s, !0)
        }
        return { restrict: "A", priority: 1e3, terminal: !0, scope: !0, compile: function(e, n) { if (("INPUT" !== e[0].tagName || "checkbox" !== n.type) && "MD-CHECKBOX" !== e[0].tagName && !n.btnCheckbox) throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.'; if (!n.checklistValue && !n.value) throw "You should provide `value` or `checklist-value`."; return n.ngModel || n.$set("ngModel", "checked"), r } }
    }

    function V(e) { return { restrict: "A", scope: { ngModel: "=", value: "=selectFindings", selected: "=selected" }, link: function(n, t, i) { e(i.ngModel) } } }

    function A(e, n, t) { return { restrict: "A", scope: !1, link: function(e, i, a) { e.isLoading = function() { return n.pendingRequests.length > 0 && "GET" == n.pendingRequests[0].method }, e.$watch(e.isLoading, function(n) { t(n ? function() { e.isLoading = n } : function() { e.isLoading = n }) }) } } }

    function P() {
        return {
            require: "ngModel",
            scope: { ngModel: "=", details: "=?" },
            link: function(e, n, t, i) {
                var a = (angular.element(n), { types: [], componentRestrictions: {'country': ['au']} });
                e.gPlace = new google.maps.places.Autocomplete(n[0], a), google.maps.event.addListener(e.gPlace, "place_changed", function() {
                    var t = e.gPlace.getPlace(),
                        a = t.geometry.location.lat(),
                        r = t.geometry.location.lng(),
                        o = t.address_components;
                    8 != Object.keys(o).length && (angular.element("#locality").val(""), angular.element("#administrative_area_level_1").val(""), angular.element("#postal_code").val(""), angular.element("#country").val("")), o = o.filter(function(e) {
                        switch (e.types[0]) {
                            case "street_number":
                                angular.element("#street_number").val(e.short_name), angular.element("#address").val(e.short_name), angular.element("#street_address1").val(e.short_name);
                                break;
                            case "route":
                                angular.element("#address").val(angular.element("#address").val() + " " + e.short_name), angular.element("#street_address1").val(angular.element("#street_address1").val() + " " + e.short_name);
                                break;
                            case "locality"://city
                                angular.element("#locality").val(e.long_name);
                                angular.element("#latitude").val(t.geometry.location.lat());
                                angular.element("#longitude").val(t.geometry.location.lng());
                                break;
                            case "administrative_area_level_1"://state
                                angular.element("#administrative_area_level_1").val(e.long_name);
                                break;
                            case "country"://country
                                angular.element("#country").val(e.short_name);
                                break;   
                            case "postal_code":
                                angular.element("#postal_code").val(e.short_name);
                                break;   
                            default:                                
                                return !1
                        }
                    }).map(function(e) { return e.long_name }), o.push(a, r), e.$apply(function() { e.details = o, i.$setViewValue(n.val()) })
                })
            },
            controller: ["$scope", "$element", "$attrs", function(e, n, t) {}]
        }
    }

    function q() {
        return {
            restrict: "EA",
            link: function(e, n) {
                function t() { n.css("display", "none") }
                var i = n.css("display");
                e.$on("$routeChangeStart", function() { n.css("display", i) }), e.$on("$routeChangeSuccess", t), e.$on("$routeChangeError", t), t()
            }
        }
    }

    function x() {
        return {
            require: "ngModel",
            link: function(e, n, t, i) {
                function a(e) { var n = e.replace(/[^a-zA-Z]/g, ""); return n !== e && (i.$setViewValue(n), i.$render()), n }
                i.$parsers.push(a)
            }
        }
    }

    function L() {
        return {
            require: "ngModel",
            link: function(e, n, t, i) {
                function a(e) { var n = e.replace(/[^\d.-]/g, ""); return n !== e && (i.$setViewValue(n), i.$render()), n }
                i.$parsers.push(a)
            }
        }
    }

    function D() {
        return {
            require: "?ngModel",
            link: function(e, n, t, i) {
                i && (i.$parsers.push(function(e) {
                    if (angular.isUndefined(e)) var e = "";
                    var n = e.replace(/[^0-9\.]/g, ""),
                        t = n.split(".");
                    return angular.isUndefined(t[1]) || (t[1] = t[1].slice(0, 2), n = t[0] + "." + t[1]), e !== n && (i.$setViewValue(n), i.$render()), n
                }), n.bind("keypress", function(e) { 32 === e.keyCode && e.preventDefault() }))
            }
        }
    }

    function E() {
        return {
            require: "ngModel",
            link: function(e, n, t, i) {
                function a(e) { var n = e.replace(/[^a-zA-Z0-9\s]/g, ""); return n !== e && (i.$setViewValue(n), i.$render()), n }
                i.$parsers.push(a)
            }
        }
    }

    function F() {
        return {
            require: "?ngModel",
            restrict: "C",
            link: function(e, n, t, i) {
                function a() {
                    if (o.length) {
                        var e = o.splice(0, 1);
                        l.setData(e[0] || "<span></span>", function() { a(), r = !0 })
                    }
                }
                var r = !1,
                    o = [],
                    l = CKEDITOR.replace(n[0]);
                l.on("instanceReady", function(e) { i && a() }), n.bind("$destroy", function() { l.destroy(!1) }), i && (l.on("change", function() { e.$apply(function() { var e = l.getData(); "<span></span>" == e && (e = null), i.$setViewValue(e) }) }), i.$render = function(e) { void 0 === i.$viewValue && (i.$setViewValue(null), i.$viewValue = null), o.push(i.$viewValue), r && (r = !1, a()) })
            }
        }
    }

    function R() {
        return {
            restrict: "A",
            compile: function(e, n) {
                return function(e, n, t) {
                    n.bind("keypress", function(e) {
                        var n = e.which || e.keyCode,
                            i = String.fromCharCode(n);
                        return i.match(new RegExp(t.allowPattern, "i")) ? void 0 : (e.preventDefault(), !1)
                    })
                }
            }
        }
    }

    function j() {
        return {
            require: "ngModel",
            restrict: "A",
            link: function(e, n, t, i) {
                function a(e) { if (e) { var n = e.replace(/[^0-9]/g, ""); return n !== e && (i.$setViewValue(n), i.$render()), parseInt(n, 10) } return void 0 }
                i.$parsers.push(a)
            }
        }
    }
    angular.module("SYNC").directive("autoFocus", n), angular.module("SYNC").directive("uniquePatientemail", t), angular.module("SYNC").directive("date", i), angular.module("SYNC").directive("appEnter", a), angular.module("SYNC").directive("appLoader", r), angular.module("SYNC").directive("toPrecision", o), angular.module("SYNC").directive("fileBrowser", l), angular.module("SYNC").directive("promiseBtn", c), angular.module("SYNC").directive("confirmOnExit", s), angular.module("SYNC").directive("clickAnywhereButHere", u), angular.module("SYNC").directive("processingData", d), angular.module("SYNC").directive("loadingData", f), angular.module("SYNC").directive("accordionPanel", g), angular.module("SYNC").directive("collapsiblePanel", p), angular.module("SYNC").directive("accordionSearch", v), angular.module("SYNC").directive("hasPermission", m), angular.module("SYNC").directive("compareTo", h), angular.module("SYNC").directive("onlyNum", k), angular.module("SYNC").directive("passwordVerify", b), angular.module("SYNC").directive("onFinishRender", y), angular.module("SYNC").directive("imageonload", M), angular.module("SYNC").directive("affectedAreas", w), angular.module("SYNC").directive("examFindings", C), angular.module("SYNC").directive("routeLoadingIndicator", T), angular.module("SYNC").directive("checklistModel", S), angular.module("SYNC").directive("selectFindings", V), angular.module("SYNC").directive("ngLoading", A), angular.module("SYNC").directive("googleplace", P), angular.module("SYNC").directive("routeLoader", q), angular.module("SYNC").directive("onlyLettersInput", x), angular.module("SYNC").directive("onlyLettersNumberSpaceInput", E), angular.module("SYNC").directive("ckEditor", F), angular.module("SYNC").directive("allowPattern", R), angular.module("SYNC").directive("onlyNumHypen", L), angular.module("SYNC").directive("onlyNumDot", D), angular.module("SYNC").directive("onlyDigits", j), angular.module("SYNC").directive("siteHeader", e), S.$inject = ["$parse", "$compile"], V.$inject = ["$parse"], A.$inject = ["$compile", "$http", "$timeout"], P.$inject = [], q.$inject = [], x.$inject = [], L.$inject = [], D.$inject = [], E.$inject = [], F.$inject = [], R.$inject = [], j.$inject = []
}();