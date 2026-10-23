import {
  Product,
  Category,
  PharmacyInfo,
  DeliverySettings,
  PaymentMethodConfig,
  CarouselBanner,
  Order
} from '../types/pharmacy';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'todos', name: 'Todos os Produtos', slug: 'todos', iconName: 'LayoutGrid' },
  { id: 'medicamentos', name: 'Medicamentos & Genéricos', slug: 'medicamentos', iconName: 'Pill' },
  { id: 'dermocosmeticos', name: 'Dermocosméticos', slug: 'dermocosmeticos', iconName: 'Sparkles' },
  { id: 'vitaminas', name: 'Vitaminas & Suplementos', slug: 'vitaminas', iconName: 'Activity' },
  { id: 'higiene', name: 'Higiene & Cuidados', slug: 'higiene', iconName: 'HeartHandshake' },
  { id: 'infantil', name: 'Mamãe & Bebê', slug: 'infantil', iconName: 'Baby' },
  { id: 'primeiros-socorros', name: 'Primeiros Socorros', slug: 'primeiros-socorros', iconName: 'ShieldPlus' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dipirona Monoidratada 500mg',
    description: 'Analgésico e antipirético indicado para o alívio de dores de cabeça, febre e dores no corpo em geral.',
    category: 'medicamentos',
    price: 9.90,
    promotionalPrice: 6.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 45,
    requiresPrescription: false,
    dosageOrVolume: '20 comprimidos',
    manufacturer: 'EMS Genéricos',
    isFeatured: true,
    activeIngredient: 'Dipirona Monoidratada'
  },
  {
    id: 'prod-2',
    name: 'Paracetamol 750mg',
    description: 'Medicamento indicado para a redução da febre e para o alívio temporário de dores leves a moderadas.',
    category: 'medicamentos',
    price: 13.50,
    promotionalPrice: 8.90,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 30,
    requiresPrescription: false,
    dosageOrVolume: '20 comprimidos revestidos',
    manufacturer: 'Medley',
    isFeatured: true,
    activeIngredient: 'Paracetamol'
  },
  {
    id: 'prod-3',
    name: 'Amoxicilina 500mg (Antibiótico)',
    description: 'Antibiótico indicado para o tratamento de infecções bacterianas causadas por germes sensíveis. Medicamento sujeito a controle especial.',
    category: 'medicamentos',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 18,
    requiresPrescription: true,
    prescriptionType: 'antibiotico',
    dosageOrVolume: '21 cápsulas',
    manufacturer: 'Eurofarma',
    isFeatured: false,
    activeIngredient: 'Amoxicilina Tri-hidratada'
  },
  {
    id: 'prod-4',
    name: 'Ibuprofeno 600mg',
    description: 'Anti-inflamatório não esteroide com ação analgésica e antitérmica. Alívio eficaz para dores musculares e inflamações.',
    category: 'medicamentos',
    price: 18.00,
    promotionalPrice: 12.50,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 50,
    requiresPrescription: false,
    dosageOrVolume: '20 comprimidos',
    manufacturer: 'Neo Química',
    isFeatured: true,
    activeIngredient: 'Ibuprofeno'
  },
  {
    id: 'prod-5',
    name: 'Protetor Solar Facial Anthelios FPS 60',
    description: 'Toque seco, alta proteção contra raios UVA/UVB com controle inteligente de oleosidade e acabamento matte.',
    category: 'dermocosmeticos',
    price: 94.90,
    promotionalPrice: 79.90,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 15,
    requiresPrescription: false,
    dosageOrVolume: '50g',
    manufacturer: 'La Roche-Posay',
    isFeatured: true,
    activeIngredient: 'Airlicium + Filtros Mexoryl'
  },
  {
    id: 'prod-6',
    name: 'Gel de Limpeza Facial CeraVe',
    description: 'Limpa profundamente e remove o excesso de oleosidade sem restaurar ou agredir a barreira protetora da pele. Contém 3 ceramidas essenciais.',
    category: 'dermocosmeticos',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1556228722-d0b71391d79e?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 22,
    requiresPrescription: false,
    dosageOrVolume: '150ml',
    manufacturer: 'CeraVe',
    isFeatured: false,
    activeIngredient: 'Ceramidas & Niacinamida'
  },
  {
    id: 'prod-7',
    name: 'Sérum Vitamina C 10% + Ácido Ferúlico',
    description: 'Poderoso antioxidante facial que uniformiza o tom da pele, previne linhas finas e devolve o viço natural.',
    category: 'dermocosmeticos',
    price: 85.00,
    promotionalPrice: 69.90,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 12,
    requiresPrescription: false,
    dosageOrVolume: '30ml',
    manufacturer: 'Dermacare Lab',
    isFeatured: true,
    activeIngredient: 'Ácido L-Ascórbico'
  },
  {
    id: 'prod-8',
    name: 'Vitamina C 1g + Zinco Efervescente',
    description: 'Suplemento alimentar efervescente com ação antioxidante para fortalecimento da imunidade e disposição.',
    category: 'vitaminas',
    price: 26.50,
    promotionalPrice: 19.90,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 40,
    requiresPrescription: false,
    dosageOrVolume: '30 comprimidos efervescentes',
    manufacturer: 'Redoxon Lab',
    isFeatured: true,
    activeIngredient: 'Ácido Ascórbico 1000mg + Zinco 10mg'
  },
  {
    id: 'prod-9',
    name: 'Vitamina D3 2.000 UI',
    description: 'Auxilia na manutenção dos ossos, absorção de cálcio e no bom funcionamento do sistema imune.',
    category: 'vitaminas',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 28,
    requiresPrescription: false,
    dosageOrVolume: '60 cápsulas moles',
    manufacturer: 'Lavitan',
    isFeatured: false,
    activeIngredient: 'Colecalciferol'
  },
  {
    id: 'prod-10',
    name: 'Ômega 3 Puro 1000mg Concentrado',
    description: 'Óleo de peixe rico em EPA e DHA, livre de metais pesados, favorece a saúde cardiovascular e cerebral.',
    category: 'vitaminas',
    price: 65.00,
    promotionalPrice: 49.90,
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb590e5b?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 19,
    requiresPrescription: false,
    dosageOrVolume: '120 cápsulas',
    manufacturer: 'Max Titanium Health',
    isFeatured: false,
    activeIngredient: 'Óleo de Peixe Concentrado'
  },
  {
    id: 'prod-11',
    name: 'Fralda Pampers Confort Sec Tamanho G',
    description: 'Canais de ar que deixam a pele do bebê arejada e sequinha por até 12 horas. Com loção hipoalergênica.',
    category: 'infantil',
    price: 74.90,
    promotionalPrice: 59.90,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 35,
    requiresPrescription: false,
    dosageOrVolume: '60 fraldas descartáveis',
    manufacturer: 'P&G Pampers',
    isFeatured: true,
    activeIngredient: 'Polímero Superabsorvente'
  },
  {
    id: 'prod-12',
    name: 'Pomada Para Assaduras Bepantol Baby',
    description: 'Fórmula com Pró-Vitamina B5 que protege o bumbum do bebê contra assaduras e reforça a barreira cutânea natural.',
    category: 'infantil',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 25,
    requiresPrescription: false,
    dosageOrVolume: '100g',
    manufacturer: 'Bayer',
    isFeatured: false,
    activeIngredient: 'Dexpantenol 5%'
  },
  {
    id: 'prod-13',
    name: 'Termômetro Digital Axilar Rápido com Bip',
    description: 'Medição precisa de temperatura em menos de 60 segundos com alarme de febre e visor LCD de fácil leitura.',
    category: 'primeiros-socorros',
    price: 25.00,
    promotionalPrice: 19.90,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 20,
    requiresPrescription: false,
    dosageOrVolume: '1 unidade + estojo',
    manufacturer: 'G-Tech',
    isFeatured: true,
    activeIngredient: 'Dispositivo Médico'
  },
  {
    id: 'prod-14',
    name: 'Curativo Adesivo Flexível Band-Aid',
    description: 'Bandagens hipoalergênicas respiráveis para proteção de pequenos cortes e ferimentos com almofada antiaderente.',
    category: 'primeiros-socorros',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 50,
    requiresPrescription: false,
    dosageOrVolume: 'Caixa com 40 unidades',
    manufacturer: 'Johnson & Johnson',
    isFeatured: false,
    activeIngredient: 'Polímero Flexível Estéril'
  },
  {
    id: 'prod-15',
    name: 'Álcool em Gel Antisséptico 70% Hidratante',
    description: 'Higienização rápida das mãos que elimina 99,9% dos germes e bactérias sem ressecar a pele.',
    category: 'higiene',
    price: 11.90,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 60,
    requiresPrescription: false,
    dosageOrVolume: '500ml com válvula pump',
    manufacturer: 'Asseptgel',
    isFeatured: false,
    activeIngredient: 'Álcool Etílico 70% INPM'
  },
  {
    id: 'prod-16',
    name: 'Loratadina 10mg Antialérgico',
    description: 'Alívio rápido para sintomas associados à rinite alérgica, como espirros, coriza, prurido e alergias na pele.',
    category: 'medicamentos',
    price: 16.90,
    promotionalPrice: 11.90,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 32,
    requiresPrescription: false,
    dosageOrVolume: '12 comprimidos',
    manufacturer: 'Medley',
    isFeatured: false,
    activeIngredient: 'Loratadina'
  }
];

export const INITIAL_BANNERS: CarouselBanner[] = [
  {
    id: 'banner-1',
    title: 'Cuidando de Você e da Sua Família',
    subtitle: 'Medicamentos, dermocosméticos e cuidados diários com entrega rápida ou retirada na loja.',
    imageUrl: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Ver Produtos em Destaque',
    categoryFilter: 'todos',
    discountBadge: 'Frete Grátis acima de R$ 90',
    active: true
  },
  {
    id: 'banner-2',
    title: 'Festival de Dermocosméticos',
    subtitle: 'Linhas completas de proteção solar, hidratação facial e tratamento para todos os tipos de pele.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Explorar Cuidados com a Pele',
    categoryFilter: 'dermocosmeticos',
    discountBadge: 'Até 25% OFF',
    active: true
  },
  {
    id: 'banner-3',
    title: 'Vitaminas e Imunidade em Alta',
    subtitle: 'Suplementos concentrados, Zinco, Vitamina C e Ômega 3 para o seu bem-estar diário.',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Conhecer Vitaminas',
    categoryFilter: 'vitaminas',
    discountBadge: 'Ofertas da Semana',
    active: true
  }
];

export const INITIAL_PHARMACY_INFO: PharmacyInfo = {
  name: 'Farmácia Vida & Saúde',
  tagline: 'Sua saúde em boas mãos, todos os dias',
  cnpj: '12.345.678/0001-90',
  responsiblePharmacist: 'Dra. Mariana Castro Ferreira',
  crf: 'CRF/SP nº 48.729',
  phone: '(11) 3456-7890',
  whatsappNumber: '5511987654321', // Can be edited in Admin
  whatsappDisplay: '(11) 98765-4321',
  email: 'contato@farmaciavidaesaude.com.br',
  addressStreet: 'Avenida Paulista',
  addressNumber: '1578',
  addressNeighborhood: 'Bela Vista',
  addressCity: 'São Paulo',
  addressState: 'SP',
  addressCep: '01310-200',
  googleMapsUrl: 'https://maps.google.com/?q=Avenida+Paulista+1578+Sao+Paulo',
  openingHoursWeekdays: 'Segunda a Sexta: 07h às 22h',
  openingHoursSaturday: 'Sábados: 08h às 20h',
  openingHoursSunday: 'Domingos e Feriados: 08h às 18h',
  prescriptionNotice: 'Medicamentos controlados e antibióticos só serão liberados mediante apresentação e retenção da receita médica válida no momento da entrega ou retirada, conforme legislação da ANVISA.',
  themePreset: 'emerald',
  primaryColorHex: '#059669',
};

export const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  deliveryFee: 7.90,
  freeDeliveryThreshold: 90.00,
  estimatedDeliveryTime: '30 a 60 minutos',
  deliveryInstructions: 'Entregamos em raio de até 7 km. O motoboy levará a maquininha de cartão caso essa forma seja escolhida.',
  coverageAreas: ['Centro', 'Bela Vista', 'Consolação', 'Jardins', 'Paraíso', 'Liberdade', 'Pinheiros'],
  pickupEstimatedTime: 'Pronto em 15 a 30 minutos',
  pickupInstructions: 'Apresente o número do pedido no balcão de atendimento com um documento de identificação.'
};

export const DEFAULT_PIX_QR_CODE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' width='240' height='240'><rect width='240' height='240' fill='%23ffffff' rx='16'/><rect x='20' y='20' width='56' height='56' fill='%230f172a' rx='8'/><rect x='28' y='28' width='40' height='40' fill='%23ffffff' rx='4'/><rect x='36' y='36' width='24' height='24' fill='%23059669' rx='4'/><rect x='164' y='20' width='56' height='56' fill='%230f172a' rx='8'/><rect x='172' y='28' width='40' height='40' fill='%23ffffff' rx='4'/><rect x='180' y='36' width='24' height='24' fill='%23059669' rx='4'/><rect x='20' y='164' width='56' height='56' fill='%230f172a' rx='8'/><rect x='28' y='172' width='40' height='40' fill='%23ffffff' rx='4'/><rect x='36' y='180' width='24' height='24' fill='%23059669' rx='4'/><rect x='92' y='24' width='16' height='16' fill='%230f172a'/><rect x='116' y='24' width='16' height='16' fill='%230f172a'/><rect x='140' y='24' width='12' height='16' fill='%230f172a'/><rect x='92' y='48' width='24' height='12' fill='%230f172a'/><rect x='128' y='48' width='24' height='12' fill='%230f172a'/><rect x='92' y='68' width='16' height='16' fill='%230f172a'/><rect x='120' y='68' width='32' height='16' fill='%230f172a'/><rect x='24' y='92' width='16' height='24' fill='%230f172a'/><rect x='48' y='92' width='28' height='16' fill='%230f172a'/><rect x='24' y='124' width='32' height='16' fill='%230f172a'/><rect x='64' y='124' width='12' height='24' fill='%230f172a'/><rect x='164' y='92' width='24' height='16' fill='%230f172a'/><rect x='196' y='92' width='24' height='24' fill='%230f172a'/><rect x='164' y='116' width='16' height='24' fill='%230f172a'/><rect x='188' y='124' width='32' height='16' fill='%230f172a'/><rect x='92' y='164' width='16' height='24' fill='%230f172a'/><rect x='116' y='164' width='32' height='16' fill='%230f172a'/><rect x='164' y='164' width='24' height='16' fill='%230f172a'/><rect x='196' y='164' width='24' height='24' fill='%230f172a'/><rect x='92' y='196' width='28' height='24' fill='%230f172a'/><rect x='128' y='196' width='20' height='24' fill='%230f172a'/><rect x='160' y='196' width='24' height='24' fill='%230f172a'/><rect x='192' y='196' width='28' height='24' fill='%230f172a'/><rect x='88' y='88' width='64' height='64' fill='%23ffffff' rx='12' stroke='%23059669' stroke-width='3'/><path d='M120 98 L138 116 L120 134 L102 116 Z' fill='%23059669'/><text x='120' y='146' text-anchor='middle' font-family='sans-serif' font-size='9' font-weight='900' fill='%23065f46'>PIX</text></svg>";

export const INITIAL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'pay-pix',
    type: 'pix',
    name: 'Pix Instantâneo',
    description: 'Aprovação imediata. Chave Pix ou QR Code.',
    instructions: 'Transfira o valor exato do pedido. A confirmação é rápida e o pedido já entra em separação assim que você enviar o comprovante!',
    enabled: true,
    pixKey: '12.345.678/0001-90',
    pixKeyType: 'cnpj',
    pixReceiverName: 'Farmácia Vida & Saúde Ltda',
    pixQrCodeImage: DEFAULT_PIX_QR_CODE,
  },
  {
    id: 'pay-card-delivery',
    type: 'credit_card',
    name: 'Cartão de Crédito ou Débito na Entrega / Retirada',
    description: 'Pague na maquininha sem contato (Aproximação, Chip ou Tarja).',
    instructions: 'O entregador levará a maquininha até seu endereço. Aceitamos Visa, Mastercard, Elo, Hipercard e American Express.',
    enabled: true,
  },
  {
    id: 'pay-cash',
    type: 'cash',
    name: 'Dinheiro na Entrega / Retirada',
    description: 'Pagamento em espécie com opção de troco.',
    instructions: 'Informe se precisará de troco para que o entregador já saia com o valor trocado pronto.',
    enabled: true,
    acceptsChangeForCash: true
  },
  {
    id: 'pay-link',
    type: 'payment_link',
    name: 'Link de Pagamento Online',
    description: 'Cartão de crédito online ou parcelamento.',
    instructions: 'Enviaremos o link seguro para você pagar com cartão de crédito direto pelo seu celular após a revisão dos itens.',
    paymentLinkUrl: 'https://pagamento.farmaciavidaesaude.com.br/checkout',
    enabled: true
  }
];

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'FVS-8492',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'Carlos Eduardo Silva',
    customerPhone: '(11) 98111-2233',
    customerCpf: '123.456.789-00',
    fulfillmentType: 'delivery',
    deliveryAddress: {
      street: 'Rua Bela Cintra',
      number: '450',
      complement: 'Apto 82',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      referencePoint: 'Próximo à estação Paulista'
    },
    paymentMethodId: 'pay-pix',
    paymentMethodName: 'Pix Instantâneo',
    items: [
      {
        productId: 'prod-1',
        productName: 'Dipirona Monoidratada 500mg',
        unitPrice: 6.99,
        quantity: 2,
        totalItemPrice: 13.98,
        requiresPrescription: false
      },
      {
        productId: 'prod-8',
        productName: 'Vitamina C 1g + Zinco Efervescente',
        unitPrice: 19.90,
        quantity: 1,
        totalItemPrice: 19.90,
        requiresPrescription: false
      }
    ],
    subtotal: 33.88,
    deliveryFee: 7.90,
    total: 41.78,
    notes: 'Tocar o interfone 82 ao chegar por favor.',
    hasPrescriptionItems: false,
    prescriptionAcknowledged: true,
    status: 'preparing',
    paymentStatus: 'paid'
  },
  {
    id: 'ord-102',
    orderNumber: 'FVS-8493',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'Mariana Ribeiro Alves',
    customerPhone: '(11) 97222-3344',
    fulfillmentType: 'pickup',
    paymentMethodId: 'pay-card-delivery',
    paymentMethodName: 'Cartão de Crédito ou Débito na Entrega / Retirada',
    items: [
      {
        productId: 'prod-5',
        productName: 'Protetor Solar Facial Anthelios FPS 60',
        unitPrice: 79.90,
        quantity: 1,
        totalItemPrice: 79.90,
        requiresPrescription: false
      }
    ],
    subtotal: 79.90,
    deliveryFee: 0,
    total: 79.90,
    hasPrescriptionItems: false,
    prescriptionAcknowledged: true,
    status: 'ready_for_pickup',
    paymentStatus: 'pay_on_delivery'
  }
];

// Presets for Admin to quickly pick high-res pharmacy product photos
export const IMAGE_PRESETS = [
  { name: 'Medicamento Cartela/Comprimidos', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
  { name: 'Frasco de Remédio', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cápsulas e Pílulas', url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dermocosmético Frasco', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sérum / Conta-gotas', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80' },
  { name: 'Loção / Creme Hidratante', url: 'https://images.unsplash.com/photo-1556228722-d0b71391d79e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Vitamina Efervescente / Suplemento', url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80' },
  { name: 'Potes de Suplemento', url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80' },
  { name: 'Bebê / Fralda / Cuidados Infantis', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
  { name: 'Termômetro & Primeiros Socorros', url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Curativos e Bandagens', url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80' },
];
