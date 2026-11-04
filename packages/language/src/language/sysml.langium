grammar SysML

// Minimal vertical-slice subset of SysML v2 textual syntax.
// Intentionally tiny: package, part def, part usage, connection.
// Grow this incrementally; it is NOT the full KerML/SysML grammar.

entry Model:
    (elements+=PackageMember)*;

PackageMember:
    Package | PartDefinition | PartUsage | Connection;

Package:
    'package' name=ID '{' (members+=PackageMember)* '}';

PartDefinition:
    'part' 'def' name=ID Body;

PartUsage:
    'part' name=ID (':' type=[PartDefinition:ID])? Body;

Connection:
    'connect' source=[PartUsage:ID] 'to' target=[PartUsage:ID] ';';

fragment Body:
    ';' | '{' (members+=PackageMember)* '}';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
