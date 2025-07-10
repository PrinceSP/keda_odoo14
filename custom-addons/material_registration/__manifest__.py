{
    "name": "Material Registration",
    "version": "1.0",
    "depends": ["base"],
    "author": "Prince Siachin",
    "category": "Inventory",
    "description": "Module for registering materials with supplier info",
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/material_registration_views.xml',
    ],
    "installable": True,
    "application": True
}
