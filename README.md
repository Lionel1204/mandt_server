## URL:
http://localhost:3000

## Create DB
Install packages
> npm install sequelize -S  
> npm install sequelize-cli -S  
> npm install mysql2 -S  

Initialize db tree  
- create a .sequelizerc
- > npx sequelize init

Create a model and a script: 
- Users
> npx sequelize model:generate --name users --attributes name:string,title:string,id_card:string,phone:string,email:string

- Projects
> npx sequelize model:generate --name projects --attributes name:string,owner:bigint,receiver:bigint,status:string,hidden:boolean,ended_at:date

- Project-Users
> npx sequelize model:generate --name project_users --attributes user_id:bigint,project_id:bigint,project_role:string

- ManifestNotes
> npx sequelize model:generate --name manifest_notes --attributes note_no:string,creator:bigint,receiver:bigint,package_amount:integer,cargo_amount:integer,status:string,project_id:bigint,ended_at:date,published_at:date

- Packages
> npx sequelize model:generate --name packages --attributes package_no:string,wrapping_type:string,shipping_type:string,size:json,weight:json,amount:integer,manifest_id:bigint,status:string

- Cargos
> npx sequelize model:generate --name cargos --attributes name:string,model:string,amount:integer,package_id:bigint,manifest_id:bigint,creator:bigint

- Paths
> npx sequelize model:generate --name paths --attributes manifest_id:bigint,paths:json

- Companies
> npx sequelize model:generate --name companies --attributes name:string,type:string,license:string,scope:string,transport:json,contact:bigint,capability:integer,memo:string

- Relationships
> npx sequelize model:generate --name relationships --attributes from:bigint,to:bigint,contact_to:bigint,memo:string

- Permissions
> npx sequelize model:generate --name permissions --attributes name:string,authority:string,description:string,user_id:bigint,path_id:bigint

- packageShippings
> npx sequelize model:generate --name package_shippings --attributes manifest_id:bigint,package_id:bigint,path_id:bigint,path_node:integer,way_bill_no:string,arrived:boolean,assignee:bigint

- Login
> npx sequelize model:generate --name logins --attributes user_id:bigint,user_phone:string,password:string,captcha:string,login_time:date

- Feedback
> npx sequelize model:generate --name feedbacks --attributes user_id:bigint,user_phone:string,problem:string,idea:string

- Position
> npx sequelize model:generate --name locations --attributes user_id:bigint,current_pos:json

Create a schema:
> npx sequelize db:create

Add other migration script:
> npx sequelize migration:generate --name add_projects_foreign_key

Write table to DB  
> npx sequelize db:migrate

Generate a Seed
> npx sequelize seed:generate --name projects

Generate a record from the seed
> npx sequelize db:seed:all

Deletes data from the database
> npx sequelize db:seed:undo:all

Reverts a migration
> npx sequelize db:migrate:undo

#Commands:
> sequelize db:migrate                        Run pending migrations
> sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
> sequelize db:migrate:status                 List the status of all migrations
> sequelize db:migrate:undo                   Reverts a migration
> sequelize db:migrate:undo:all               Revert all migrations ran
> sequelize db:seed                           Run specified seeder
> sequelize db:seed:undo                      Deletes data from the database
> sequelize db:seed:all                       Run every seeder
> sequelize db:seed:undo:all                  Deletes data from the database
> sequelize db:create                         Create database specified by configuration
> sequelize db:drop                           Drop database specified by configuration
> sequelize init                              Initializes project
> sequelize init:config                       Initializes configuration
> sequelize init:migrations                   Initializes migrations
> sequelize init:models                       Initializes models
> sequelize init:seeders                      Initializes seeders
> sequelize migration:generate                Generates a new migration file      [aliases: migration:create]
> sequelize model:generate                    Generates a model and its migration [aliases: model:create]
> sequelize seed:generate                     Generates a new seed file           [aliases: seed:create]

Start MySQL
> mysql.server start

# PM2
> pm2 start npm -- start
> pm2 start <json>
