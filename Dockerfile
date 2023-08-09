# Use uma imagem base para o Node.js
FROM --platform=linux/amd64  node:lts

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Define o usuário
USER root

# Copie apenas os arquivos necessários para o diretório de trabalho
COPY package.json yarn.lock ./

# Instale as dependências do projeto
RUN yarn

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Exponha a porta 3000 (do Nest.js)
EXPOSE 3000

# Execute o comando para rodar o seu servidor Node.js
CMD ["sh", "-c", "npx prisma generate && yarn start:dev"]