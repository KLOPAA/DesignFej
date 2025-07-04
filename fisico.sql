create database tcc;

use tcc;

drop table usuario;
drop table pedido;
drop table joia;
drop table carrinho;
drop table pagamento;

create table usuario(
id_usuario int primary key auto_increment not null,
nome varchar(50) not null,
email varchar(50) not null,
senha varchar(50) not null,
cep char(9) not null,
num_casa varchar(10) not null
)engine= innoDB;

create table carrinho(
id_carrinho int primary key auto_increment not null,
quantidade_pedida int not null,
total_pagar double not null,
cupons varchar(10),
fk_carrinho int not null,
foreign key (fk_carrinho) references usuario(id_usuario)
) engine = innoDB;

create table joia (
id_joia int primary key auto_increment not null,
desc_joia varchar(500),
preco double not null,
fk_joia int not null,
foreign key (fk_joia) references carrinho (id_carrinho)
) engine = innoDB;

create table pedido(
id_pedido int primary key auto_increment not null,
preco_pagar int not null,
comprador int not null,
foreign key (comprador) references usuario (id_usuario) 
)engine = innoDb;

create table pagamento(
id_pagamento int primary key auto_increment not null,
total double not null,
data_pag date not null,
frete double not null,
fk_pagamento int not null,
foreign key (fk_pagamento) references pedido (id_pedido)
)engine=innoDB;

create table pix(
id_pix int primary key auto_increment not null,
valor_pix double not null,
FK_PIX INT NOT NULL,
foreign key (fk_pix) references pagamento (id_pagamento)
)engine= innoDB;

create table cartao(
id_cartao int primary key auto_increment not null,
valor_cartao double not null,
tipo enum('debito','credito'),
fk_cartao int not null,
foreign key (fk_cartao) references pagamento (id_pagamento)
)engine = innoDB;

create table boleto(
id_boleto int primary key auto_increment not null,
valor_boleto double not null,
fk_boleto int not null,
foreign key (fk_boleto) references pagamento (id_pagamento)
)engine=innoDB;

create table desc_carrinho(
id_desckart int primary key auto_increment not null,
tamanho_aro1 double not null,
tamanho_aro2 double not null,
gravacao1 varchar(200),
gravacao2 varchar(200),
fk_kart int not null,
foreign key (fk_kart) references carrinho (id_carrinho)
)engine=innoDB;

create table catalogo(
id_catalogo int primary key auto_increment not null,
nome varchar(50) not null
)engine = innoDB;

create table joia_catalogo(
fk_catalogo int not null,
fk_joia int not null,

foreign key (fk_catalogo)references catalogo (id_catalogo),
foreign key (fk_joia)references joia (id_joia)
)engine=innoDB;