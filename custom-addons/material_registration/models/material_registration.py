from odoo.tests.common import TransactionCase

class TestMaterialRegistration(TransactionCase):

    def test_create_material(self):
        material = self.env['material.registration'].create({
            'code': 'MAT-001',
            'name': 'Denim Fabric',
            'material_type': 'jeans',
            'buy_price': 150,
            'supplier_id': self.env['res.partner'].create({'name': 'Test Supplier', 'supplier_rank': 1}).id
        })
        self.assertEqual(material.buy_price, 150)
