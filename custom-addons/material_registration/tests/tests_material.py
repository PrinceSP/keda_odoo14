from odoo.tests.common import TransactionCase, tagged

@tagged('-standard', 'create_material')
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
        self.assertEqual(material.supplier_id, supplier.id)
        self.assertEqual(material.buy_price, 120)
        self.assertEqual(material.supplier_id.name, 'Test Supplier')
        
    def test_read_material(self):
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
        self.assertEqual(supplier.name, 'Test Project')
        self.assertEqual(material.name, 'Premium Fabric')

