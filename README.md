Caso tenha o node instalado, rode o comando `node` + o nome da pasta/arquivo que quer. Ex: `node lexicalAnalysis/automaton`. (Mas se tiver o Node instalado, sugiro instalar as dependências com `npm install` e rodar `npm run dev lexicalAnalysis`, assim você vai poder rodar/editar diretamente o código-fonte e o input)

Caso contrário, apenas cole o conteúdo dos arquivos `.js` num console do browser (geralmente apertando F12) que ele irá retornar a tabela léxica do código da especificação. Contudo, dessa forma não é possível mudar o input fornecido (a menos que instale o Node, as dependências, troque o input e rode `npm run build`, em qual caso entramos na recomendação acima).

Para buildar, rode: `npm install`, `npm run build`