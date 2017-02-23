install: ;@echo "Installing deps"; \
	mix deps.get;
	yarn install;

db: ;@echo "Creating database"; \
	mix ecto.create

migrate: ;@echo "Migrating database"; \
	mix ecto.migrate

drop-db: ;@echo "Droping database"; \
	mix ecto.drop

reset-db: ;@echo "Reseting database"; \
	make drop-db; \
	make db; \
	make migrate;

seed: ;@echo "Seeding database"; \
	mix run priv/repo/seeds.exs --seed

unseed: ;@echo "Unseeding database"; \
	mix run priv/repo/seeds.exs --unseed

reseed: ;@echo "Reseeding database"; \
	make unseed; \
	make seed;
