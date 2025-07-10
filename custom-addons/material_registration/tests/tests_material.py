from odoo.tests.common import TransactionCase

class TestMaterialRegistration(TransactionCase):

    def test_create_material(self):
        supplier = self.env['res.partner'].create({
            'name': 'Test Supplier',
            'is_supplier': True
        })

        material = self.env['material.registration'].create({
            'code': 'MAT-001',
            'name': 'Premium Fabric',
            'material_type': 'fabric',
            'buy_price': 120,
            'supplier_id': supplier.id
        })

        self.assertEqual(material.buy_price, 120)
        self.assertEqual(material.supplier_id.name, 'Test Supplier')
