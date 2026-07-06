import java.io.File;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

public class XMLValidatorDual {

    public static void main(String[] args) {
        String xmlFile = "C:\\Users\\sir\\IdeaProjects\\exp6\\src\\bookstore.xml";
        String xsdFile = "C:\\Users\\sir\\IdeaProjects\\exp6\\src\\bookstore.xsd";

        System.out.println("=================================================");
        System.out.println("         DUAL XML VALIDATOR (DTD & XSD)          ");
        System.out.println("=================================================");

        // Step 1: Perform DTD Validation
        boolean isDtdValid = validateDTD(xmlFile);

        System.out.println(); // Formatter space

        // Step 2: Perform XSD Validation
        boolean isXsdValid = validateXSD(xmlFile, xsdFile);

        System.out.println("=================================================");
        System.out.println("SUMMARY STATUS:");
        System.out.println("-> DTD Validation Status: " + (isDtdValid ? "PASSED" : "FAILED"));
        System.out.println("-> XSD Validation Status: " + (isXsdValid ? "PASSED" : "FAILED"));
        System.out.println("=================================================");
    }

    /* -----------------------------------------------------------------
       1. DTD VALIDATION METHOD
       Uses DocumentBuilderFactory validation configuration
       ----------------------------------------------------------------- */
    private static boolean validateDTD(String xmlPath) {
        System.out.println("[Phase 1] Initiating DTD Validation...");
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

            // Instruct the parser to run DTD validation
            factory.setValidating(true);
            factory.setNamespaceAware(true);

            DocumentBuilder builder = factory.newDocumentBuilder();

            // Set custom error handler to catch DTD validation mismatches
            builder.setErrorHandler(new ErrorHandler() {
                @Override
                public void warning(SAXParseException e) {
                    System.out.println("   Warning: " + e.getMessage());
                }

                @Override
                public void error(SAXParseException e) throws SAXException {
                    System.err.println("   DTD Rule Violation: " + e.getMessage() + " (Line: " + e.getLineNumber() + ")");
                    throw e; // Terminate validation and mark as failed
                }

                @Override
                public void fatalError(SAXParseException e) throws SAXException {
                    System.err.println("   Fatal Error: " + e.getMessage());
                    throw e;
                }
            });

            // Parse XML (it will read and validate bookstore.dtd internally)
            builder.parse(new File(xmlPath));
            System.out.println("[SUCCESS] XML matches structural DTD successfully.");
            return true;

        } catch (SAXException e) {
            System.err.println("[FAILURE] DTD Validation failed due to a structural mismatch.");
            return false;
        } catch (Exception e) {
            System.err.println("[ERROR] System Exception: " + e.getMessage());
            return false;
        }
    }

    /* -----------------------------------------------------------------
       2. XSD VALIDATION METHOD
       Uses SchemaFactory and Validator configurations
       ----------------------------------------------------------------- */
    private static boolean validateXSD(String xmlPath, String xsdPath) {
        System.out.println("[Phase 2] Initiating XSD Validation...");
        try {
            // Setup SchemaFactory for standard W3C schema validations
            SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);

            // Load and parse XSD rules
            Schema schema = factory.newSchema(new File(xsdPath));

            // Build validator instance
            Validator validator = schema.newValidator();

            // Validate the XML target file
            validator.validate(new StreamSource(new File(xmlPath)));
            System.out.println("[SUCCESS] XML matches type-definition XSD successfully.");
            return true;

        } catch (SAXException e) {
            System.err.println("[FAILURE] XSD Validation failed: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("[ERROR] System Exception: " + e.getMessage());
            return false;
        }
    }
}