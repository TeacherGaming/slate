# TeacherGaming Slate

<p align="center">
	<h5>This site is running at <a href="https://teachergaming.github.io/slate/">teachergaming.github.io/slate/</a></h5>
</p>

Getting Started with Slate
------------------------------

### Prerequisites

You're going to need:

 - **Linux or OS X** — Windows may work, but is unsupported.
 - **Ruby, version 2.2.5 or newer**
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.

### Getting Set Up

1. Clone this repository.
3. Go to cloned folder.
4. Initialize and start Slate. You can either do this locally, or with Vagrant:

```shell
# either run this to run locally
bundle install
bundle exec middleman server

# OR run this to run with vagrant
vagrant up
```

You can now see the docs at http://localhost:4567. Whoa! That was fast!

### Creating changes

Pages are being included from `source/index.html.md`. All editable files are in `source/includes` folder.

### Publishing changes

After all is fine in the main branch, run `./deploy.sh`

### More information

- [editing Slate markdown](https://github.com/lord/slate/wiki/Markdown-Syntax)
- [how to publish your docs](https://github.com/lord/slate/wiki/Deploying-Slate)