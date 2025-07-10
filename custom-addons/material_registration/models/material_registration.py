from odoo import models, fields, api
from odoo.exceptions import ValidationError

class MaterialRegistration(models.Model):
    _name = 'material.registration'
    _description = 'Material Registration'
    _order = 'name'

    code = fields.Char(string='Material Code', required=True)
    name = fields.Char(string='Material Name', required=True)
    material_type = fields.Selection(
        [('fabric', 'Fabric'), ('jeans', 'Jeans'), ('cotton', 'Cotton')],
        string='Material Type',
        required=True
    )
    buy_price = fields.Float(string='Buy Price', required=True)
    supplier_id = fields.Many2one(
        'res.partner', 
        string='Supplier', 
        domain="[('is_supplier', '=', True)]", 
        required=True
    )

    @api.constrains('buy_price')
    def _check_buy_price(self):
        for record in self:
            if record.buy_price < 100:
                raise ValidationError("Buy Price must be at least 100.")
