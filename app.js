(function () {
  'use strict';

  angular.module('blogApp', [])
    .factory('api', function($http) {
      const base = '/api/posts';
      return {
        list: () => $http.get(base).then(r => r.data),
        create: (data) => $http.post(base, data).then(r => r.data),
        update: (id, data) => $http.put(base + '/' + id, data).then(r => r.data),
        remove: (id) => $http.delete(base + '/' + id).then(r => r.data),
      };
    })
    .controller('MainCtrl', function($scope, api) {
      const vm = this;
      vm.posts = [];
      vm.form = { title: '', content: '', author: '' };
      vm.editing = false;
      vm.editId = null;

      function load() {
        api.list().then(data => vm.posts = data);
      }

      vm.savePost = function() {
        if (!vm.form.title || !vm.form.content) return;
        if (vm.editing && vm.editId) {
          api.update(vm.editId, vm.form).then(function() {
            vm.reset();
            load();
          });
        } else {
          api.create(vm.form).then(function() {
            vm.reset();
            load();
          });
        }
      };

      vm.startEdit = function(p) {
        vm.editing = true;
        vm.editId = p._id;
        vm.form = { title: p.title, content: p.content, author: p.author || '' };
      };

      vm.deletePost = function(p) {
        if (!confirm('Delete this post?')) return;
        api.remove(p._id).then(load);
      };

      vm.reset = function() {
        vm.editing = false;
        vm.editId = null;
        vm.form = { title: '', content: '', author: '' };
      };

      load();
    });
})();
