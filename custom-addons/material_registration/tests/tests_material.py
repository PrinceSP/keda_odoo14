from odoo.tests.common import TransactionCase

class TestMaterialRegistration(TransactionCase):

    def test_create_material(self):
        material = self.env['material.registration'].create({
            'code': 'M001',
            'name': 'Cotton Fabric',
            'material_type': 'cotton',
            'buy_price': 120,
            'supplier_id': self.env.ref('base.res_partner_1').id
        })
        self.assertEqual(material.name, 'Cotton Fabric')

    def test_buy_price_constraint(self):
        with self.assertRaises(Exception):
            self.env['material.registration'].create({
                'code': 'M002',
                'name': 'Cheap Fabric',
                'material_type': 'fabric',
                'buy_price': 50,
                'supplier_id': self.env.ref('base.res_partner_1').id
            })
