'use strict';
var path = require('path');
var ComponentGenerator = require('../componentGenerator');
var Generator = module.exports = ComponentGenerator.extend({

    constructor: function() {
        this.basetype = 'component'; // this will create a property this.componentname
        this.basefolder = 'components'; // this is the folder for the components
        this.hasOwnFolder = true; // to specify if the component files should be in a subfolder
        this.isDasherize = true; // to specify that the file name should be dasherized
        ComponentGenerator.apply(this, arguments);

        this.option('targettype', {
            desc: 'The type of target',
            type: String,
            hide: false
        });
    },

    initializing: function() {
        Generator.__super__.initializing.apply(this, arguments);
        this.mixins.beautifyTs();
    },

    prompting: function() {
        var done = this.async();
        var self = this;
        var extraPrompts = [{
            type: 'list',
            name: 'targettype',
            default: 'web',
            when: function() {
                return !self.options.targettype || self.options.targettype.length <= 0;
            },
            message: 'What type of component do you want to create?',
            choices: ['web']
        }];
        Generator.__super__.prompting.call(this, done, extraPrompts);

    },

    configuring: function() {
        Generator.__super__.configuring.apply(this, arguments);
        this.targettype = this.answers.targettype || this.options.targettype;
    },

    writing: function() {
        var destinationPath = Generator.__super__.writing.apply(this, arguments);
        //var componentnameFile = this.componentname; //this.mixins.dasherize(this.componentname); // could be componentname

        switch (this.targettype) {
            case 'web':
                this.fs.copyTpl(
                    this.templatePath('_component.ts'),
                    this.destinationPath(path.join(destinationPath, 'index.ts')), {
                        componentnameFile: this.componentnameFile,
                        componentname: this.componentname,
                        componentnameClass: this.componentnameClass
                    }
                );

                this.fs.copyTpl(
                    this.templatePath('_component.spec.ts'),
                    this.destinationPath(path.join(destinationPath, 'spec.ts')), {
                        componentnameFile: this.componentnameFile,
                        componentname: this.componentname,
                        componentnameClass: this.componentnameClass,
                        assertPath: path.relative(path.join(destinationPath, 'spec.ts'), path.join('src','app', 'assert')).replace(/\\/g,"/")                        
                    }
                );

                this.fs.copyTpl(
                    this.templatePath('_component.html'),
                    this.destinationPath(path.join(destinationPath, 'template.html')), {
                        componentname: this.componentname
                    }
                );
                this.fs.copyTpl(
                    this.templatePath('_component.scss'),
                    this.destinationPath(path.join(destinationPath, 'style.scss'))
                );
                break;
        }

    }

});
