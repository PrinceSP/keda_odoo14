from odoo import models, fields

class ResPartner(models.Model):
    _inherit = 'res.partner'

    is_material_supplier = fields.Boolean(string="Material Supplier")
