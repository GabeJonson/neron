$(document).ready(function() {
  task.init();
});

let task = (function() {
  let URL = 'https://592ac6c690c9d500119cdc2e.mockapi.io/task';

  return {
    init: function() {
      this.getTasks();
      this.slideToggle();
      this.buttonsClick();
      this.saveTask();
      this.closeTask();
      this.changeTask();
      this.projectSort();
    },

    getTasks: function() {
      let self = this;

      $.get(URL, function(data) {
        data.map(function(item) {
          self.parseData(item);
        });
      });
    },

    parseData: function(data) {
      $('.scroll').append('<div class="task-container">' +
          '<input type="hidden" id="item-id" value="' + data.id + '"/>' +
          '<div class="title">' + data.title +'</div>' +
          '<p class="project inline">Project <span class="project-title">' + data.project +'</span></p>' +
          '<p class="priority inline">Priority <span class="priority-number">' + data.priority + '</span></p>' +
          '<p class="descriptoin">' + data.description + '</p>' +
          '<div class="buttons-container">' +
            '<button class="btn change">change</button>' +
            '<button class="btn close">close</button>' +
            '<button class="btn slideToggle">Up</button>' +
          '</div>' +
        '</div>'
      );
    },

    slideToggle: function() {
      $(document).on('click', '.slideToggle', function() {
        $(this).parents('.task-container').find('.descriptoin').slideToggle('fast').toggleClass('isShowed');

        if($('.descriptoin').hasClass('isShowed')) {
          $(this).html('Down');
        } else {
          $(this).html('Up');
        }
      });
    },

    buttonsClick: function() {
      $('.newTask').on('click', function() {
        $('.add-new').fadeToggle('fast');
      });

      $('.cancel').on('click', function(e) {
        e.preventDefault();

        $('input, textarea').each(function(key, item) {
          item.value = '';
        });
      });

      $(document).on('click', '.cancel_2', function(e) {
        e.preventDefault();

        $(this).parent().find('input, textarea').each(function(key, item) {
          item.value = '';
        });

        $(this).parent().fadeOut('fast', function() {
          $(this).parents('.task-container').find('.buttons-container').slideDown('fast');
        });
      });
    },

    saveTask: function() {
      let self = this;

      $('.save').on('click', function(e) {
        e.preventDefault();

        $.post(URL, {
          title: $('#title').val(),
          project: $('#project').val(),
          priority: $('#proprity').val(),
          description: $('#description').val()
        }).done(function(data) {
          self.parseData(data);

          $('.add-new').fadeOut('fast');
        });
      });

      $(document).on('click', '.save_2', function(e) {
        e.preventDefault();

        $.ajax({
          method: 'PUT',
          url: URL + '/' + $('#item-id').val(),
          data: {
            title: $('#title_2').val(),
            project: $('#project_2').val(),
            priority: $('#proprity_2').val(),
            description: $('#description_2').val()
          }
        }).done(function(data) {
          self.parseData(data);
        });

        $(this).parents('.task-container').remove();
        $(this).parents('form').fadeOut('fast');
      });
    },

    closeTask: function() {
      $(document).on('click', '.close', function() {
        $(this).parents('.task-container').slideUp('fast', function() {
          $.ajax({
            method: 'DELETE',
            url: URL + '/' + $('#item-id').val()
          });

          $(this).remove();
        });
      });
    },

    changeTask: function() {
      let self = this;

      $(document).on('click', '.change', function() {
        $(this).parent().slideUp('fast');

        $(this).parents('.task-container').append(self.changeInputs());

        let title = $(this).parents('.task-container').find('.title').html();
        let project = $(this).parents('.task-container').find('.project-title').html();
        let priority = $(this).parents('.task-container').find('.priority-number').html();
        let descriptoin = $(this).parents('.task-container').find('.descriptoin').html();

        $('#title_2').val(title);
        $('#project_2').val(project);
        $('#proprity_2').val(priority);
        $('#description_2').val(descriptoin);
      });
    },

    changeInputs: function() {
      return ('<form>' +
          '<div class="form-group">' +
            '<label>Название задачи</label>' +
            '<input id="title_2" type="text">' +
          '</div>' +
          '<div class="form-group">' +
            '<label>Название проекта</label>' +
            '<input id="project_2" type="text">' +
          '</div>' +
          '<div class="form-group">' +
            '<label>Приоритет</label>' +
            '<select id="proprity_2">' +
              '<option value="1">1</option>' +
              '<option value="2">2</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label>Описание</label>' +
            '<textarea id="description_2"></textarea>' +
          '</div>' +
          '<button class="save_2">Save</button>' +
          '<button class="cancel_2">cancel</button>' +
        '</form>');
    },

    projectSort: function() {
      $('#project_sort').on('change', function() {
        $('.project-title').each(function(key, item) {
          let itemContent = item.innerHTML.toLocaleLowerCase();
          let projectSort = $('#project_sort').val();

          if(itemContent.indexOf(projectSort) !== -1) {
            let self = this;

            $('.task-container').fadeOut('fast', function() {
              $(self).parents('.task-container').fadeIn('fast');
            });
          }

          if(projectSort == 'all') {
            $('.task-container').fadeIn('fast');
          }
        })
      });
    }
  }
})();
