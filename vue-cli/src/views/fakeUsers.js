;[
  {
    'repeat(100)': {
      id: '{{index()}}',
      isActive: '{{bool()}}',
      balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
      avatar: '',
      age: '{{integer(20, 40)}}',
      firstName: '{{firstName()}}',
      lastName: '{{surname()}}',
      company: '{{company().toUpperCase()}}',
      email: function(tags) {
        return `${this.firstName}.${this.lastName}@${
          this.company
        }${tags.domainZone()}`.toLowerCase()
      },
      phone: '+7 {{phone()}}',
      address:
        '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
      about: '{{lorem(1, "paragraphs")}}',
      registered: '{{moment(this.date(new Date(2014, 0, 1), new Date())).format("LLLL")}}'
    }
  }
]
