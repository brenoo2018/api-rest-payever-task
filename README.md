<p align="center">
</p>
<h3 align="center">Payever API REST</h3>
<p align="center">
</p>
<br>

## Payever REST API

This API service was developed with the purpose of solving the challenge proposed by Payever's team.

### Tools used:

- Nestjs
- mailer
- Rabbitmq
- Prisma
- Mongodb

## Quick start

- Clone this repository (`git clone https://github.com/brenoo2018/api-rest-payever-task.git`)
- Inside the folder, run: `yarn`
- Populate the environment variables as it is in `.env.example`
- Install docker on your machine (`https://docs.docker.com/get-docker/`)
- Then run: `docker compose up -d`
- The run: `npx prisma generate`
- Finally: `yarn start:dev`

## Routes

| Request | Route                  | Body                         | Answer   | Description             |
| ------- | ---------------------- | ---------------------------- | -------- | ----------------------- |
| POST    | `/users/create`        | first_name, last_name, email | `object` | User Creation Route     |
| GET     | `/api/user/:id`        |                              | `object` | Single User Fetch Route |
| GET     | `/api/user/:id/avatar` |                              | `object` | Route fetch user avatar |
| DELETE  | `/api/user/:id/avatar` |                              |          | User Removal Route      |

## Tests

- `yarn test` to run all tests

## Acknowledgements

I would like to thank the Payever company team for the challenge opportunity. It wasn't a complex project, but I ended up having some connection issues that made it take longer than expected.

## License

Nest is [MIT licensed](LICENSE).
