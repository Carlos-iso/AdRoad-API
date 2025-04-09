### **Documentação para Testes - Schema Advertiser**

#### **1. JSON de Teste Válido**
```json
{
  "name_enterprise": "Tech Solutions LTDA",
  "email": "contato@techsolutions.com.br",
  "cnpj": "12.345.678/0001-99",
  "password": "SenhaSegura@123",
  "balance_ad": 0,
  "adress": {
    "street": "Rua das Inovações",
    "number": "42",
    "complement": "Sala 101",
    "neighborhood": "Tecnopolis",
    "city": "Natal",
    "state": "RN",
    "postalCode": "59078-500"
  }
}
```

#### **2. Exemplo de Erro (Estado Inválido)**
```json
{
  "error": "Atendemos apenas no RN (UF inválida ou não disponível)",
  "details": {
    "received": "SP",
    "expected": "RN"
  }
}
```

---

### **Tabela de Explicação**

| **Campo**           | **Valor Exemplo**               | **Regra de Validação**                          | **Observações**                                  |
|---------------------|--------------------------------|------------------------------------------------|------------------------------------------------|
| `state`             | `"RN"`                         | Deve ser exatamente `"RN"` (maiúsculas)        | Único estado atendido atualmente.              |
|                     | `"SP"` (inválido)              | Rejeita com erro customizado                   | Mensagem clara para o usuário.                 |
| `postalCode`        | `"59078-500"`                  | Formato `XXXXX-XXX` ou `XXXXXXXX`              | Aceita com ou sem hífen.                       |
| `cnpj`              | `"12.345.678/0001-99"`         | Válido com/sem pontuação (`12345678000199`)    | `unique: true` evita duplicatas.               |
| `password`          | `"SenhaSegura@123"`            | Mínimo 8 caracteres                            | Recomenda-se maiúsculas, números e símbolos.   |

---

### **Tabela de Respostas da API**

| **Cenário**               | **Status Code** | **Resposta JSON**                              |
|--------------------------|----------------|-----------------------------------------------|
| **Sucesso**               | `201 Created`  | Retorna o objeto criado com `_id` e timestamps. |
| **Estado Inválido**       | `400 Bad Request` | Mensagem de erro customizada (ex.: `"Atendemos apenas RN"`). |
| **CNPJ Duplicado**        | `400 Bad Request` | `"CNPJ já cadastrado"`                        |
| **Formato de CEP Inválido** | `400 Bad Request` | `"CEP inválido"`                             |

---

### **Como Usar Este Documento**
1. **Testes Manuais**:  
   - Copie o JSON válido para testes no Postman/Insomnia.  
   - Modifique campos como `state` para simular erros.  

2. **Validações Futuras**:  
   - Se novos estados forem atendidos, atualize `enum` no schema e nesta tabela.  

3. **Padronização**:  
   - Mantenha o formato de erro consistente (`error` + `details`).
---