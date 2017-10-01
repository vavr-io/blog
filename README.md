# Vavr Blog Developer Guide

This repository contains the source code of the Vavr blog. It is based on [Ghost](https://ghost.org) and hosted at [Clever Cloud](https://clever-cloud.com).

## Branches of this repository

* [master](https://github.com/vavr-io/blog/tree/master) - Contains only this README.
* [ghost](https://github.com/vavr-io/blog/tree/ghost) - Contains the unmodified Ghost version downloaded [here](https://ghost.org/developers).
* [blog](https://github.com/vavr-io/blog/tree/blog) - Rebased on the `ghost` branch, contains adjustments for hosting at Clever Cloud.

## Cloning this repository

```bash
# get a copy
git clone https://github.com/vavr-io/blog.git
cd blog

# add clever cloud remote repo
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_ea7499a8-d913-4bcc-9c14-5705b4263dd0.git
```

## Ghost Version Update

### Backup

First of all, do a database backup! Go to https://blog.vavr.io/ghost and visit the 'Labs' menu item. Then use 'Export your content' to export the blog contents. These do not include the images, they are stored in the filesystem-bucket.

### Update

New Ghost versions are downloaded as .zip [here](https://ghost.org/developers). The contents are extracted to the `ghost` branch. We create a new commit and do not squash previous commits. Then the `blog` branch is rebased on the `ghost` branch. Finally we push the `blog` branch to Clever Cloud.

```bash
# Switch to ghost releases branch
git checkout ghost
# Copy downloaded files...
cp -r path-to-ghost/* .
# Commit the unmodified release, replace x.y.z with the current version
git commit -a -m "Ghost-x.y.z"
# Push the changes to Github
git push -u origin ghost

# Switch to blog branch hosted in the cloud
git checkout blog
# Then rebase the blog branch on the newest version in ghost branch
# and fix conflicts (e.g. using GitUp).
# Then push the changes to origin (tracking that location).
git push -u origin blog --force
# Finally push changes of the blog branch to Clever Cloud (not tracking that location).
git push clever blog:master --force
```

## Database Migration

Currently it is not clear if the database is migrated automatically. However, there exists a workaround:

1. Install a local MySQL database

```bash
brew info mysql
brew install mysql
mysqld
mysqladmin -u root password '<secret>'
```

2. Create a database 'blog' and a user 'vavr':

```bash
mysql --user root --password=root
# -- revert: DROP DATABASE blog;
> CREATE DATABASE IF NOT EXISTS blog;
# -- revert: DROP USER 'vavr'@'localhost';
> CREATE USER 'vavr'@'localhost' IDENTIFIED BY '<secret>';
> GRANT ALL ON blog.* TO 'vavr'@'localhost';
> FLUSH PRIVILEGES;
> SHOW GRANTS FOR 'vavr'@'localhost';
```

3. Create Ghost database and dump it

```bash
# once
npm install -g knex-migrator
knex-migrator init
mysqldump --user vavr --password=<secret> blog > blog.sql
```

4. Import the initial database dump into the Clever Cloud database

```bash
# This can be done with with mysql on the shell (see MySQL add-on on Clever Cloud) or using Clever Cloud's PhpMyAdmin.
```

5. Finally, the content backup (json) is imported

```bash
# Ghost admin page / Labs
```

---

## Info: Adjustments to Ghost for Clever Cloud

Ghost reads the production configuration from a file `config.production.json`. We put secret configuration details into Clever Cloud's environment variables. Ghost is based on node.js, a json file can't refer to process.env variables. Therefore we generate the configration on-the-fly at application startup.

Ghost stores images in `/content/images`. These are erased each time we push a new version of the blog source to Clever Cloud because the application is immutable. We removed the images folder and added a filesystem bucket that is mounted to the images folder. That way the images are persisted.
